declare module "stablecoins.json" {
  type network = {
    id: number;
    name: "polygon" | "mumbai" | "kovan";
    tokens: Array<[string, string]>;
  };
  type networks = Array<network>;

  export default networks;
}
