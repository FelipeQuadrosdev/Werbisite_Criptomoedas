import { Link, useNavigate } from "react-router-dom"
import styles from "./home.module.css"
import { BsSearch } from "react-icons/bs"
import { useState, FormEvent, useEffect } from "react"

export interface moedasProps {
    id: string;
    rank: string;
    symbol: string;
    name: string;
    priceUsd: string;
    vwap24Hr: string;
    changePercent24Hr: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    explorer: string;
    formatoMoeda?: string;
    formatoMarket?:string;
    formatoVolume?:string;
}
interface dataProps {
    data: moedasProps[]
}

export default function Home() {
    const [input, setInput] = useState("");
    const [moedas, setMoedas] = useState<moedasProps[]>([])
    const [carregarMoedas,setCarregarMoedas]= useState(0)

    const navigate = useNavigate()

    function DetalheMoeda(e: FormEvent) {
        e.preventDefault();

        if (input === "") return;
        navigate(`/detail/${input}`)
    }

    function CarregarMoedas() {
      if(carregarMoedas ===0){
        setCarregarMoedas(10)
        return;
      }
      setCarregarMoedas(carregarMoedas + 10)
    }

    useEffect(() => {

        getData()
    }, [carregarMoedas])

    async function getData() {
        fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${carregarMoedas}`)
            .then((response) => response.json())
            .then((item: dataProps) => {
                const moedasTotal = item.data

                const price = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD"
                })

                const priceCompact = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    notation:"compact"
                })


                const formatoResultado = moedasTotal.map((item) => {
                    const formatado = {
                        ...item,
                        formatoMoeda: price.format(Number(item.priceUsd)),
                        formatoMarket:priceCompact.format(Number(item.marketCapUsd)),
                        formatoVolume:priceCompact.format(Number(item.volumeUsd24Hr))
                    }
                    return formatado;

                })

                const TodasMoedas =[...moedas,...formatoResultado]

                setMoedas(TodasMoedas)

            })

    }

    return (
        <main className={styles.container}>
            <form className={styles.form} onSubmit={DetalheMoeda}>
                <input
                    type="text"
                    placeholder="Digite o nome da moeda... Ex bitcoin"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">
                    <BsSearch size={30} color="#fff" />
                </button>
            </form>

            <table>
                <thead>
                    <th>Moeda</th>
                    <th>Valor Mercado</th>
                    <th>Preço</th>
                    <th>Volume</th>
                    <th>Mudança 24h</th>
                </thead>

                <tbody id="tbody">

                    {moedas.length>0 && moedas.map((item) => (

                        <tr className={styles.tr} key={item.id}>
                            <td className={styles.tdLabel} data-label="Moeda">
                                <div className={styles.name}>
                                    <img 
                                    className={styles.logo}
                                    alt="Logo da Criptmoeda"
                                    src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`}/>
                                    <Link to={`./detail/${item.id}`}>
                                        <span>{item.name}</span> |{item.symbol}
                                    </Link>
                                </div>

                            </td>

                            <td className={styles.tdLabel} data-label="Valor Mercado">
                                {item.formatoMarket}
                            </td>


                            <td className={styles.tdLabel} data-label="Preço">
                                {item.formatoMoeda}
                            </td>

                            <td className={styles.tdLabel} data-label="Volume">
                                {item.formatoVolume}
                            </td>

                            <td className={Number(item.changePercent24Hr) >0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança 24h">
                                <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                            </td>
                        </tr>

                    ))}


                </tbody>

            </table>
            <button className={styles.ButtonMoedas} onClick={CarregarMoedas} >
                Carregar mais
            </button>
        </main>
    )

}