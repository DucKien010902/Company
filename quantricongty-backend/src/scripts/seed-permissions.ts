import { ALL_PERMISSIONS } from '../common/constants/permission-catalog';

async function main() {
  console.log('Permission catalog for this project:');
  console.log(JSON.stringify(ALL_PERMISSIONS, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
