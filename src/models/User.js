import { Schema, model } from "mongoose";

const userSchema= new Schema({
    userName: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    public_id: String
},{
    timestamps: true    // guarda la fecha de cracion y actualizacion del objeto.
});

const User = model('User', userSchema);

export default User;