import { useRouter } from "next/router";
import Link from "next/link";

import coffeeStoresData from "../../data/coffee-stores.json";
import Head from "next/head";

import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";

import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../public/utils";

export async function getStaticProps(staticProps) {
    const coffeeStores = await fetchCoffeeStores();
    const params = staticProps.params;
    const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
        return coffeeStore.id === params.id;
    });
    return {
        props: {
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
        },
    };
}

export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores();
    const paths = coffeeStores.map(coffeeStore => {
        return {
            params: {
                id: coffeeStore.id.toString()
            }
        }
    });
    return {
        paths,
        fallback: true
    };
}

const CoffeeStore = (initialProps) => {
    const router = useRouter();

    const id = router.query.id;

    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

    const {
        state: {
            coffeeStores
        }
    } = useContext(StoreContext);

    useEffect(() => {
        if (isEmpty(initialProps.coffeeStore)) {
            if (coffeeStores.length > 0) {
                const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
                    return coffeeStore.id === id;
                });
                setCoffeeStore(findCoffeeStoreById)
            }
        }
    }, [id]);

    if (router.isFallback) {
        return <div>Loading...</div>
    }

    const { address, neighborhood, name, imgUrl } = coffeeStore;

    const handleUpvoteButton = () => { };

    return (
        <div className={styles.layout}>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href="/">
                            <a>&larr; Back to home</a>
                        </Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <h1 className={styles.name}>{name}</h1>
                    </div>
                    <Image
                        src={imgUrl || "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"}
                        width={600}
                        height={360}
                        className={styles.storeImg}
                        alt={name}
                    />
                </div>

                <div className={cls("glass", styles.col2)}>
                    {address && <div className={styles.iconWrapper}>
                        <Image src="/static/icons/places.svg" width="24" height="24" />
                        <p className={styles.text}>{address}</p>
                    </div>}
                    {neighborhood && <div className={styles.iconWrapper}>
                        <Image src="/static/icons/nearMe.svg" width="24" height="24" />
                        <p className={styles.text}>{neighborhood}</p>
                    </div>}
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/star.svg" width="24" height="24" />
                        <p className={styles.text}>1</p>
                    </div>

                    <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
                        Up vote!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoffeeStore;