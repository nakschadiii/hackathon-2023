"use client"
import Image from 'next/image'
import { useState, useEffect, useRef } from "react";
const __baegendeu_hochul = (route, body, callback) => fetch("http://localhost:8000/"+route, {method: (route !== null) ? "POST" : "GET", body: body}).then(response=>response.json()).then(callback)

export default function Home() {
    return <>
        <section>
            <div className='flex justify-center gap-8 p-4 h-20'>
                <img src='citizensync_text3.png' className=''/>
                <div className='flex align-center gap-4'>
                    <button>Accueil</button>
                    <button>Accueil</button>
                    <button>Accueil</button>
                </div>
            </div>
        </section>
        <section>
            <App.Blocks.Login />
        </section>
    </>
}

const App = {
    Blocks : {
        Login : function ({}) {
            return <form onSubmit={(e) => {
                e.preventDefault();
                const getValue = (field) => e.target.elements[field].value
                __baegendeu_hochul(
                    "login",
                    {id : getValue("id"), pswd : getValue("pswd")},
                    data => console.log(data)
                );
            }}>
                <input type='text' placeholder='ID / Email' name='id' />
                <input type='password' placeholder='Mot de passe' name='pswd' />
                <button>Connexion</button>
            </form>
        }
    }
}