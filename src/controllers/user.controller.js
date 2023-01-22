import User from '../models/User.js';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { serialize } from 'cookie'
import bcrypt from 'bcrypt'
//dotenv.config();

const UsersCtrl = {};

UsersCtrl.getUsers = async (req, res) => {
    const { myToken } = req.cookies;
    console.log(req.cookies);

    if(!myToken){
        res.status(401).json({ msj: 'There is not token.' })
        return;
    }

    try {
        const datos = jwt.verify(myToken, process.env.SECRET )

        res.status(200).json({ msj: 'Valid token', username: datos.username, email: datos.email });
    } catch (error) {
        // si ocurre un error es porque el token no es valido: 
        // 1-Porque es un token falso 
        // 2-Porque expiró
        res.status(401).json({ msj: 'Invalid token' })
    }

}

UsersCtrl.getProfile = async (req, res) => {
    const { myToken } = req.cookies;
    console.log(req.cookies)

    if(!myToken){
        res.status(401).json({ msj: 'There is not token.' })
        return;
    }
    try {
        const datos = jwt.verify(myToken, process.env.SECRET )

        res.status(200).json({ msj: 'Valid token', username: datos.username, email: datos.email});
    } catch (error) {
        res.status(401).json({ msj: 'Invalid token' })
    }

}

UsersCtrl.register = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ userName: username });
    // si no existe un usuario con ese nombre se crea uno
    if (!user) {
        bcrypt.hash(password, 8, async (err, hash) => {
            if (err) {
                console.log(err);
                res.json({ ok: 'error', msj: 'No se pudo crear el usuario, errror en bcrypt.' })
            }
            if (hash) {
                const newUser = new User({
                    userName: username,
                    password: hash
                });

                const saved = await newUser.save();

                if (saved) {
                    res.status(201).json({ msj: "User created." })
                } else {
                    res.status(500).json({ msj: "User Not Saved. (500)=>Internal server error" })
                }
            }
        });
    } else {
        res.status(409).json({ msj: 'Ya existe un usuario con ese nombre. (409)=>The request could not be processed because of conflict in the request' })
    }
}

UsersCtrl.logout = async (req, res) => {  
    const { myToken } = req.cookies;

    if(!myToken){
        return res.status(401).json({ msj: 'There is not token.' });
    }
    try {
        jwt.verify(myToken, process.env.SECRET ) // se verifica si el token es correcto para cerrar la sesion

        const unDia = 86400000;
        const fechaExp = new Date( Date.now() - unDia ); 

        const serializedToken = serialize('myToken', null, {
            httpOnly: false,     // para que no pueda ser leido desde la consola del navegador setear en true
            sameSite: 'none',                           // si el back y el front estan en el mismo dominio
            secure: true,
            expires: fechaExp,  // ayer
            maxAge: 0,  // duracion de la cookie: 0 min
            path: '/'            
        });
        res.setHeader('Set-Cookie', serializedToken);

        res.status(200).json({ msj: 'Logout!'});

    } catch (error) {
        res.status(401).json({ msj: 'Invalid token' })
    }

}


UsersCtrl.login = async (req, res) => {  

    const { username, password } = req.body;

    const result = await User.findOne({ userName: username });

    if (result && (await bcrypt.compare(password, result.password))) {

        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 1),  // expira en 1 minuto
            username: "martin",
            email: "martincho_cqc@hotmail.com"
        }, process.env.SECRET);

        const milisegundos = 1000 * 60;
        const fechaExp = new Date( Date.now() + milisegundos ); 
         
        const serializedToken = serialize('myToken', token, {
            httpOnly: false,     // para que no pueda ser leido desde la consola del navegador setear en true
            sameSite: 'none',                           // si el back y el front estan en el mismo dominio
            secure: true,
            expires: fechaExp,
            maxAge: 10 ,  // duracion de la cookie en segundos
            path: '/'            
        });

        res.setHeader('Set-Cookie', serializedToken);

        // res.cookie('myCookie', serializedToken, {
        //     httpOnly: false,     // para que no pueda ser leido desde la consola del navegador setear en true
        //     sameSite: 'none',                           // si el back y el front estan en el mismo dominio
        //     secure: true,
        //     maxAge: 1000 * 60 * 5,  // duracion 5 min
        //     path: '/'
        // });

        res.status(200).json({ msj: 'loged!!!' })

    } else {
        res.status(401).json({ error: "username or password invalid" });
    }
}

export default UsersCtrl;