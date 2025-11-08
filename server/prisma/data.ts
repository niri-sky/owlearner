type AdminDataType = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'moderator';
  status?: 'active' | 'pending';
};

export const SEED_ADMIN_DATA: AdminDataType[] = [
  // {
  //   name: 'Rashed Iqbal',
  //   email: 'dev.rashediqbal@gmail.com',
  //   password: 'parasite',
  //   role: 'admin',
  //   status: 'active',
  // },
  // {
  //   name: 'Hasanul Haque Banna',
  //   email: 'hasanulhaquebanna@gmail.com',
  //   password: 'programmerbanna',
  //   role: 'moderator',
  //   status: 'active',
  // },
  // {
  //   name: 'Rashed Iqbal',
  //   email: 'rashediq6al@gmail.com',
  //   password: 'parasite',
  //   role: 'admin',
  //   status: 'active',
  // },
  {
    name: 'Rashed Iqbal',
    email: 'rashediqbalripon@gmail.com',
    password: 'parasite',
    role: 'admin',
    status: 'active',
  },
];
