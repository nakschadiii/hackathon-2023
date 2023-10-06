import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import './globals.css'

import Jeu from "./jeu";

import ReactEcharts from "echarts-for-react"; 
import { io } from "socket.io-client";
const socket = io();
socket.removeAllListeners();
const __backend = (method, route, content, responseHandler) => socket.emit('__baeg-endeu_hochul', {method: method, route: route}, content, responseHandler);
document.querySelector('#root').classList = `bg-stone-900 text-white grid grid-cols-1 grid-rows-[min-content_auto] bg-fixed`;
const arrayColumn = (array, column) => { return array?.map(item => item[column]); };
function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

export const App = {
    Root: () => {
        return (
            <html>
                <head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>My app</title>
                </head>
                <body>
                    
                </body>
            </html>
        );
    },
    
    Layout: () => {
        const [logged, setLogged] = useState(!!localStorage.getItem('IDkey'));
        const [data, setData] = useState(Jeu);
        useEffect(() => {
            const int = setInterval(() => {
                setLogged(!!localStorage.getItem('IDkey'))
            }, 0);
            return () => clearInterval(int);
        }, [])
        console.log(logged);

        useEffect(() => {
            const int = setInterval(() => {
                __backend("GET", "data", null, res => setData(res));
                console.log(data)
            }, 3000);
            return () => clearInterval(int);
        }, [data])

        return <>
            <section>
                <div className='flex justify-center gap-8 p-4 h-20'>
                    <img src='citizensync_text3.png' className='' />
                    <div className='flex align-center gap-4 [&_a]:flex [&_a]:h-full [&_a]:items-center'>
                        <button><Link to={"/"}>Accueil</Link></button>
                        {logged && <button><Link to={"/logout"}>Déconnexion</Link></button>}
                    </div>
                </div>
            </section>
            <section className='px-8 grid grid-cols-12 grid-rows-auto gap-4'>
                <Routes>
                    {logged && <Route path='/' element={<App.Pages.Logged_Home />} />}
                    {logged && <Route path='/logout' element={<App.Pages.Logout />} />}
                    {!logged && <Route path='/' element={<App.Pages.NLogged_Home />} />}
                    <Route path='*' element={<Navigate to="/" />} />
                </Routes>
                <div className='col-span-12'>
                    <App.LilStuff.Box>
                        <App.Blocks.Charts data={data} />
                    </App.LilStuff.Box>
                </div>
            </section>
        </>
    },

    Pages: {
        Logged_Home: ({ arg }) => <>logged</>,
        NLogged_Home: ({ arg }) => <>
            <App.Blocks.Identification.Box className={"col-span-12 h-fit"} />
            {/* <App.Blocks.HomeGrid /> */}
        </>,
        Article: ({ arg }) => <></>,
        Chat: ({ arg }) => <></>,
        Logout: ({ arg }) => <App.Blocks.Identification.Logout />,
    },

    Blocks: {
        Identification : {
            Box : function ({ className }) {
                const [LogOrReg, setLOR] = useState("login");
                return <App.LilStuff.Box className={className}>
                    <div className='[&>*]:bg-transparent [&>*]:border-y [&>*]:border-r [&>*:nth-child(1)]:border-l [&>*:first-child]:rounded-l-lg [&>*:last-child]:rounded-r-lg [&>*:has(input:checked)]:bg-lime-500 [&>*:has(input:checked)]:text-white [&>*]:py-3 [&>*]:px-4 text-sm py-4'>
                        <label><input type="radio" name='LogOrReg' className='hidden' onChange={(e) => setLOR("login")} defaultChecked={true} />Connexion</label>
                        <label><input type="radio" name='LogOrReg' className='hidden' onChange={(e) => setLOR("register")} />Inscription</label>
                    </div>
                    {{"login" : <App.Blocks.Identification.Login />, "register" : <App.Blocks.Identification.Register />}[LogOrReg]}
                </App.LilStuff.Box>;
            },

            Login : function ({ arg }) {
                return <form onSubmit={(e) => {
                    e.preventDefault();
                    const getValue = (field) => e.target.elements[field].value;
                    __backend("POST", "login", {id : getValue("id"), password : getValue("pswd")}, res => {
                        console.log(res);
                        if (res.status) localStorage.setItem("IDkey", res.id);
                        [...e.target.elements].map((element) => element.value = null);
                    });
                }} className='grid grid-cols-1 gap-4 p-4'>
                    <h1 className='text-4xl font-medium'>Connexion</h1>
                    <div className='grid grid-cols-1 -mt-2'>
                        <input type='text' placeholder='ID / Email' name='id' className='p-2' />
                        <hr />
                        <input type='password' placeholder='Mot de passe' name='pswd' className='p-2' />
                    </div>
                    <div className='grid grid-cols-1 justify-items-center gap-2'>
                        <App.LilStuff.Button type="submit" className='bg-lime-500 w-full'>Connexion</App.LilStuff.Button>
                        <Link to={"/forgotten-password"} className='text-lime-500'>Mot de passe oublié</Link>
                    </div>
                </form>
            },

            Register : function ({ arg }) {
                return <></>
            },

            Logout : function ({ arg }) {
                localStorage.removeItem('IDkey');
                return <></>
            }
        },
        HomeGrid : function({ }) {
            const grid = useRef(null);
            const [rowsHeightBase, setRHB] = useState(0)
            useEffect(() => {
                const int = setInterval(() => setRHB([grid?.current.clientWidth]), 0);
                return () => clearInterval(int);
            }, [grid])

            return <div ref={grid} className="gap-4 p-4 text-zinc-950 grid [&>div]:grid grid-cols-4 [&>div]:grid-cols-1 gap-4 [&>div]:gap-4" style={{gridTemplateRows: rowsHeightBase+"px"}}>
                <div>
                    <App.LilStuff.Box className='row-span-2' />
                    <App.LilStuff.Box />
                    <App.LilStuff.Box />
                    <App.LilStuff.Box />
                </div>
                <div>  
                    <App.LilStuff.Box />
                    <App.LilStuff.Box />
                    <App.LilStuff.Box />
                    <App.LilStuff.Box />
                </div>
                <div>
                    <App.LilStuff.Box />
                    <App.LilStuff.Box />
                    <App.LilStuff.Box />
                    <App.LilStuff.Box />
                </div>
                <div>
                    <App.LilStuff.Box />
                    <App.LilStuff.Box />
                    <App.LilStuff.Box />
                    <App.LilStuff.Box />
                </div>
            </div>
        },
        Charts : function ({ data }) {
            /* const example = data["evaluation-climat-budget_par_politique_publique"];
            const diagrams = {};

            example?.forEach(element => {
                if(diagrams[element.annee] === undefined) diagrams[element.annee] = [];
                diagrams[element.annee].push(element);
            });

            const charts = [];
            for (const [year, data_] of Object.entries(diagrams)) {
                charts.push(<ReactEcharts option={{
                    xAxis: { data: arrayColumn(data_, "politique_publique") },
                    yAxis: {},
                    series: [
                      { type: 'bar', data: arrayColumn(data_, "resultats_tres_favorables") },
                      { type: 'bar', data: arrayColumn(data_, "resultats_plutot_favorables") },
                      { type: 'bar', data: arrayColumn(data_, "resultats_neutres") },
                      { type: 'bar', data: arrayColumn(data_, "resultats_defavorables") },
                      { type: 'bar', data: arrayColumn(data_, "resultats_indefinis") },
                    ]
                }} />)
            };

            return charts.map(chart => chart) */
            const example = data["qualite-de-l-air-concentration-moyenne-no2-pm2-5-pm10"];
            const example2 = data["qualite-de-l-air-indice-atmo"];
            const example3 = data["evaluation-climat-budget_par_politique_publique"];

            example?.sort((a, b) => a.annee.localeCompare(b.annee));
            example2?.sort((a, b) => a.annee.localeCompare(b.annee));
            example3?.sort((a, b) => a.annee.localeCompare(b.annee));

            return <>
                <ReactEcharts option={{
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { type: 'cross' }
                    },
                    legend: {
                        // Try 'horizontal'
                        orient: 'horizontal',
                        bottom: 10,
                    },
                    xAxis: { type: "category", data: arrayColumn(example, "annee") },
                    yAxis: {},
                    series: [
                    { type: 'line', smooth: true, name: 'Moyenne annuelle de NO2 dans Paris', data: arrayColumn(example, "no2_fond_urbain_moyenne_annuelle_airparif"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'line', smooth: true, name: 'Moyenne annuelle de NO2 à proximité du trafic routier', data: arrayColumn(example, "no2_proximite_trafic_moyenne_annuelle_airparif"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', smooth: true, name: 'Moyenne reglementée et recommandée', data: arrayColumn(example, "no2_reglementaire"), label: { show: false, position: 'bottom', textStyle: { fontSize: 15 } } },
                    //   { type: 'bar', data: arrayColumn(example, "o3_moyenne_annuelle_airparif") },
                    //  { type: 'bar', data: arrayColumn(example, "pm2_5_fond_urbain_moyenne_annuelle_airparif") }
                    ]
                }} />

                <ReactEcharts option={{
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { type: 'cross' }
                    },
                    legend: {
                        // Try 'horizontal'
                        orient: 'horizontal',
                        bottom: 10
                    },
                    xAxis: { type: "category", data: arrayColumn(example, "annee") },
                    yAxis: {},
                    series: [
                    { type: 'line', smooth: true, name: 'Moyenne annuelle d\'ozone dans Paris', data: arrayColumn(example, "o3_moyenne_annuelle_airparif"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', smooth: true, name: 'Moyenne recommandée', data: arrayColumn(example, "o3_recommandation_oms"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', smooth: true, name: 'Moyenne reglementée', data: arrayColumn(example, "o3_reglementaire"), label: { show: false, position: 'bottom', textStyle: { fontSize: 15 } } },
                    //   { type: 'bar', data: arrayColumn(example, "") },
                    //  { type: 'bar', data: arrayColumn(example, "pm2_5_fond_urbain_moyenne_annuelle_airparif") }
                    ]
                }} />

                <ReactEcharts option={{
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { type: 'cross' }
                    },
                    legend: {
                        // Try 'horizontal'
                        orient: 'horizontal',
                        bottom: 10
                    },
                    xAxis: { type: "category", data: arrayColumn(example, "annee") },
                    yAxis: {},
                    series: [
                    { type: 'line', smooth: true, name: 'Moyenne annuelle de particules en suspension dans Paris', data: arrayColumn(example, "pm10_fond_urbain_moyenne_annuelle_airparif"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'line', smooth: true, name: 'Moyenne annuelle de particules en suspension, à proximité du trafic', data: arrayColumn(example, "pm10_proximite_trafic_moyenne_annuelle_airparif"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'line', smooth: true, name: 'Moyenne annuelle de particules fines en suspension dans Paris', data: arrayColumn(example, "pm2_5_fond_urbain_moyenne_annuelle_airparif"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', stack: 'a', name: 'Moyenne recommandée de particules fines', data: arrayColumn(example, "pm2_5_recommandation_oms"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', stack: 'd', name: 'Moyenne reglementée de particules fines', data: arrayColumn(example, "pm2_5_reglementaire"), label: { show: false, position: 'bottom', textStyle: { fontSize: 15 } } },
                    { type: 'bar', stack: 'b', name: 'Moyenne recommandée de particules en suspension', data: arrayColumn(example, "pm10_recommandation_oms"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', stack: 'c', name: 'Moyenne reglementée de particules en suspension', data: arrayColumn(example, "pm10_reglementaire"), label: { show: false, position: 'bottom', textStyle: { fontSize: 15 } } },
                    ]
                }} />

                <ReactEcharts option={{
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { type: 'cross' }
                    },
                    legend: {
                        // Try 'horizontal'
                        orient: 'horizontal',
                        bottom: 10
                    },
                    xAxis: { type: "category", data: arrayColumn(example2, "annee") },
                    yAxis: {},
                    series: [
                    { type: 'bar', smooth: true, name: 'Bonne', data: arrayColumn(example2, "ind_jour_qa_bonne"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', smooth: true, name: 'Moyenne', data: arrayColumn(example2, "ind_jour_qa_moyenne"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', smooth: true, name: 'Dégradée', data: arrayColumn(example2, "ind_jour_qa_degradee"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', smooth: true, name: 'Mauvaise', data: arrayColumn(example2, "ind_jour_qa_mauvaise"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', smooth: true, name: 'Très mauvaise', data: arrayColumn(example2, "ind_jour_qa_tres_mauvaise"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', smooth: true, name: 'Extremement mauvaise', data: arrayColumn(example2, "ind_jour_qa_extremement_mauvaise"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    //   { type: 'bar', data: arrayColumn(example, "") },
                    //  { type: 'bar', data: arrayColumn(example, "pm2_5_fond_urbain_moyenne_annuelle_airparif") }
                    ]
                }} />

                {arrayColumn(example3, 'annee').filter(onlyUnique)?.map(a => <ReactEcharts key={1} option={{
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { type: 'cross' }
                    },
                    legend: {
                        // Try 'horizontal'
                        orient: 'horizontal',
                        bottom: 10
                    },
                    xAxis: { type: "category", axisTick: { alignWithLabel: true }, axisLabel: { rotate: 30 }, data: arrayColumn(example3?.filter(e => e.annee === a), "politique_publique") },
                    yAxis: {  },
                    series: [
                    { type: 'bar', stack: 'a', name: 'Favorables', data: arrayColumn(example3?.filter(e => e.annee === a), "resultats_tres_favorables"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', stack: 'a', name: 'Plutôt favorables', data: arrayColumn(example3?.filter(e => e.annee === a), "resultats_plutot_favorables"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', stack: 'a', name: 'Neutres', data: arrayColumn(example3?.filter(e => e.annee === a), "resultats_neutres"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', stack: 'a', name: 'Défavorables', data: arrayColumn(example3?.filter(e => e.annee === a), "resultats_defavorables"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    { type: 'bar', stack: 'a', name: 'Indéfinis', data: arrayColumn(example3?.filter(e => e.annee === a), "resultats_indefinis"), label: { show: false, position: 'top', textStyle: { fontSize: 15 } }},
                    ]
                }} />)}
            </>

            /* for (const [year, data_] of Object.entries(example)) {
                charts.push()
            };

            return charts.map(chart => chart) */
        }
    },

    LilStuff: {
        Box : ({children, className=null}) => <div className={['p-4 bg-white rounded-lg shadow-2xl shadow-black overflow-hidden text-zinc-900', className].join(' ')}>{children}</div>,
        Button : ({children, className=null, type="button"}) => <button type={type} className={['p-2 text-white font-medium rounded-lg', className].join(' ')}>{children}</button>
    }
};


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App.Layout />
        </BrowserRouter>
    </React.StrictMode>,
)