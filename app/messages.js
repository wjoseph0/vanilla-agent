import { pb } from '../pocketbase.js';

pb.collection('messages').subscribe('*', (e) => {
  console.log(e.record);
});