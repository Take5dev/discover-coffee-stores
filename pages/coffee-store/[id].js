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
import { isEmpty, fetcher } from "../../public/utils";

import useSWR from "swr";

export async function getStaticProps(staticProps) {
    const params = staticProps.params;

    const coffeeStores = await fetchCoffeeStores();
    const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id; //dynamic id
    });
    const returnVal = {
        props: {
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
        },
    };
    return returnVal;
}

export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores();
    const paths = coffeeStores.map((coffeeStore) => {
        return {
            params: {
                id: coffeeStore.id.toString(),
            },
        };
    });
    return {
        paths,
        fallback: true,
    };
}

const CoffeeStore = (initialProps) => {
    const router = useRouter();

    const id = router.query.id;

    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {});

    const {
        state: {
            coffeeStores
        }
    } = useContext(StoreContext);

    const handleCreateCoffeeStore = async (coffeeStore) => {
        try {
            const {
                id,
                name,
                address,
                neighborhood,
                votes,
                imgUrl
            } = coffeeStore;
            const response = await fetch('/api/createCoffeeStore?', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    name,
                    address: address || "",
                    neighborhood: neighborhood || "",
                    votes: 0,
                    imgUrl
                }),
            });
            const dbResponse = await response.json();
        } catch (err) {
            console.error('Error creating coffee store', err);
        }
    };

    useEffect(() => {
        if (!router.isFallback) {
            if (isEmpty(initialProps.coffeeStore)) {
                if (coffeeStores.length > 0) {
                    const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
                        return coffeeStore.id.toString() === id; //dynamic id
                    });
                    setCoffeeStore(findCoffeeStoreById);
                    handleCreateCoffeeStore(findCoffeeStoreById);
                }
            }
            else {
                handleCreateCoffeeStore(initialProps.coffeeStore)
            }
        }
    }, [id, initialProps.coffeeStore, coffeeStores, router]);

    const {
        name = "",
        address = "",
        neighborhood = "",
        imgUrl = "",
    } = coffeeStore;

    const [votesCount, setVotesCount] = useState(1);

    const { data, error } = useSWR(`/api/getCoffeeStoreByID?id=${router.query.id}`, fetcher);
    useEffect(() => {
        if (data && data.length > 0) {
            setCoffeeStore(data[0]);
            setVotesCount(data[0].votes);
        }
    }, [data]);

    if (router.isFallback) {
        return <div>Loading...</div>
    }

    const handleUpvoteButton = async () => {

        try {
            const response = await fetch('/api/favouriteCoffeeStoreByID?', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id
                })
            });
            const dbResponse = await response.json();
            if (dbResponse && dbResponse.length > 0) {
                setVotesCount(prevState => prevState + 1);
            }
        } catch (err) {
            console.error('Error upvoting coffee store', err);
        }
    };

    if (error) {
        return <div>Something went wrong retrieving coffee store page</div>
    }

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
                        <p className={styles.text}>{votesCount}</p>
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