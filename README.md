# Dropper

Feed your address QR into the dropper's scanner and get some ETH!

## Quickstart

1. Clone this repo & install dependencies

```
git clone https://github.com/carletex/testnet-dropper
git switch testnet-dropper
cd testnet-dropper
yarn install
```

2. Start the chain for local testing

```shell
yarn chain
```

3. Add `WALLET_PRIVATE_KEY` in `packages/nextjs/.env.local` (can be hardhat 0th account)

4. Start your NextJS app (front-end + backend):

```
yarn start
```

5. Important files:

- Login api: https://github.com/carletex/testnet-dropper/blob/0e4aaf50b87ad4cc2ddf0f51dbf9e1e110546144/packages/nextjs/app/api/login/route.ts
- Trigger faucet api: https://github.com/carletex/testnet-dropper/blob/0e4aaf50b87ad4cc2ddf0f51dbf9e1e110546144/packages/nextjs/app/api/trigger-faucet/route.ts
- Trigger frontend logic: https://github.com/carletex/testnet-dropper/blob/0e4aaf50b87ad4cc2ddf0f51dbf9e1e110546144/packages/nextjs/app/page.tsx
- Constants: https://github.com/carletex/testnet-dropper/blob/0e4aaf50b87ad4cc2ddf0f51dbf9e1e110546144/packages/nextjs/utils/faucet.ts

## Admin

- Add your address in [ADMIN_ADDRESSES](https://github.com/carletex/testnet-dropper/blob/cb8a39e8d5f65fab53dc7897df2f19a2b65e5626/packages/nextjs/utils/faucet.ts#L4)
- If the address is in `ADMIN_ADDRESSES` frontend should give "sign" button beside connected wallet button on top right

## Deployment

- Update the `scaffold.config.ts#targetNetwork` with chain of your choice

- Make sure `WALLET_PRIVATE_KEY` is set in `pacakges/nextjs/.env.local` and funded

- Update the `REQUEST_SECRET` in `package/nextjs/.env.local`
