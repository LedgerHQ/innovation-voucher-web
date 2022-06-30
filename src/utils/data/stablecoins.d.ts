declare module "stablecoins.json" {
  export type token = { ticker: string; address: string; decimals: number };
  export type network = {
    id: number;
    name: "polygon" | "mumbai" | "kovan" | "rinkeby";
    tokens: Array<token>;
  };
  type networks = Array<network>;

  export default networks;
}
