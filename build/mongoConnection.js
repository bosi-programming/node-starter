"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDataBase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const encryption_1 = require("./util/encryption");
const url = encryption_1.decrypt('YbeAuyhVGSEnwn/vdm/x5G2hG1U1BRDMPrvT7vn+4XBv9tpkRTqQOjSb9rjz1Gc277KL81F0BUkOoL72j8gpgy/CMmRcVMwQHLnEOWIOJrQ5j34nZP07iXcaK+5INaci2nRKSjd0NzQwLqiF58GxwBLp5E+lT+Coalg0GL807tX2YVA8yolGrT3C4bZ6oZ5ZbAlgODHitie25giwa0XriBCnpI4pqo2YS9TsSarQ6koJmB0aJL3a1i1SLvpLHxRRtwbj', 'banana');
const connectToDataBase = () => {
    mongoose_1.default.connect(url, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
};
exports.connectToDataBase = connectToDataBase;
