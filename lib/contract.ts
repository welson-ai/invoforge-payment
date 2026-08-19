import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  nativeToScVal,
  scValToNative,
  Address,
} from "@stellar/stellar-sdk";
import { getAddress, signTransaction } from "@stellar/freighter-api";

const CONTRACT_ID = "CCCVBY3SCHOWYSGNCBFIT46CTBX2A6OD6U5344JGMZO47ZRJRVN4MBM4";
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;

const server = new SorobanRpc.Server(RPC_URL);
const contract = new Contract(CONTRACT_ID);

export async function recordPayment(to: string, amount: number, asset: string) {
  const { address: publicKey } = await getAddress();
  const account = await server.getAccount(publicKey);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        "record_payment",
        new Address(publicKey).toScVal(), // from
        new Address(to).toScVal(), // to
        nativeToScVal(amount, { type: "i128" }), // amount
        nativeToScVal(asset, { type: "string" }), // asset
      ),
    )
    .setTimeout(30)
    .build();

  // Simulate first
  const prepared = await server.prepareTransaction(tx);

  // Sign with Freighter
  const { signedTxXdr } = await signTransaction(prepared.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  // Submit and get hash
  const response = await server.sendTransaction(
    TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE),
  );

  const txHash = response.hash;

  // Poll until confirmed
  let result = await server.getTransaction(txHash);
  while (result.status === "NOT_FOUND") {
    await new Promise((r) => setTimeout(r, 1000));
    result = await server.getTransaction(txHash);
  }

  return {
    txHash,
    explorerUrl: `https://stellar.expert/explorer/testnet/tx/${txHash}`,
    status: result.status,
  };
}

export async function getTransactionCount(): Promise<number> {
  const { address: publicKey } = await getAddress();
  const result = await server.simulateTransaction(
    new TransactionBuilder(await server.getAccount(publicKey), {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call("get_transaction_count"))
      .setTimeout(30)
      .build(),
  );

  if (SorobanRpc.Api.isSimulationSuccess(result) && result.result) {
    return scValToNative(result.result.retval) as number;
  }
  return 0;
}
