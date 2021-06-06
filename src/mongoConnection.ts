import mongoose from 'mongoose';
import { decrypt } from './util/encryption';

const url = decrypt('YbeAuyhVGSEnwn/vdm/x5G2hG1U1BRDMPrvT7vn+4XBv9tpkRTqQOjSb9rjz1Gc277KL81F0BUkOoL72j8gpgy/CMmRcVMwQHLnEOWIOJrQ5j34nZP07iXcaK+5INaci2nRKSjd0NzQwLqiF58GxwBLp5E+lT+Coalg0GL807tX2YVA8yolGrT3C4bZ6oZ5ZbAlgODHitie25giwa0XriBCnpI4pqo2YS9TsSarQ6koJmB0aJL3a1i1SLvpLHxRRtwbj', 'banana');

export const connectToDataBase = () => {
  mongoose.connect(
    url,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  );
};
