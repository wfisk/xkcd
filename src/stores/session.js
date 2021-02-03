import { writable } from 'svelte/store';

const session = writable({
  user: null
});

export default session;