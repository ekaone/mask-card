# If using ts-node
npx ts-node examples/basic.ts
npx ts-node examples/combine.ts

# Or compile first
npm run build
node -r esbuild-register examples/basic.ts
node -r esbuild-register examples/combine.ts