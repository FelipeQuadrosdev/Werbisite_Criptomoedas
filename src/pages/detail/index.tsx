import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { moedasProps } from "../home"
import styles from "../detail/detail.module.css"

interface ResponseData {
    data: moedasProps
}

interface ErrorData {
    error: string
}

type DataProps = ResponseData | ErrorData

export default function Detail() {
    const [detalhes, setDetalhes] = useState<moedasProps>()
    const[carregando,setCarregando] =useState(true)
    const { cripto } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function detalhesMoedas() {
            try {
                fetch(`https://api.coincap.io/v2/assets/${cripto}`)
                    .then(response => response.json())
                    .then((data: DataProps) => {

                        if ("error" in data) {
                            navigate("/")
                            return;
                        }
                        const price = Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD"
                        })

                        const priceCompact = Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            notation: "compact"
                        })

                        const resulData = {
                            ...data.data,
                            formatoMoeda: price.format(Number(data.data.priceUsd)),
                            formatoMarket: priceCompact.format(Number(data.data.marketCapUsd)),
                            formatoVolume: priceCompact.format(Number(data.data.volumeUsd24Hr))
                        }
                        setDetalhes(resulData)
                        setCarregando(false)
                    })
            }
            catch (error) {
                console.log(error)
                navigate("/")
            }

        }
        detalhesMoedas()
    }, [cripto])

    if(carregando || !detalhes){
        return(
        <div className={styles.container}>
            <h4 className={styles.center}>Carregando detalhes...</h4>
        </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.center}>{detalhes?.name}</h1>
            <h1 className={styles.center}>{detalhes?.symbol}</h1>

            <section className={styles.content}>
                <img 
                src={`https://assets.coincap.io/assets/icons/${detalhes?.symbol.toLocaleLowerCase()}@2x.png`}
                alt="logo da Moeda"
                className={styles.logo}
                />
                <h1>{detalhes?.name} | {detalhes?.symbol}</h1>

                <p><strong>Preço:</strong>{detalhes?.formatoMoeda}</p>

                <a>
                    <strong>Mercado:</strong>{detalhes?.formatoMarket}
                </a>

                <a>
                    <strong>Volume:</strong>{detalhes?.formatoVolume}
                </a>

                <a>
                    <strong>Mudança 24h:</strong><span className={Number(detalhes?.changePercent24Hr)> 0 ? styles.profit: styles.loss}> {Number(detalhes?.changePercent24Hr).toFixed(3)}</span>
                </a>
            </section>
        </div>
    )

}