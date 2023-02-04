import { createApi } from 'unsplash-js';

const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY
});

const getURLforCoffeeStores = (latLng, query, limit) => {
    return `https://api.foursquare.com/v3/places/nearby?ll=${latLng}&query=${query}&limit=${limit}`;
};

const getListofCoffeeStorePhotos = async () => {
    const photos = await unsplash.search.getPhotos({
        query: 'coffee shop',
        page: 1,
        perPage: 30,
        orientation: 'landscape',
    });
    const unsplashResults = photos.response.results

    return unsplashResults.map(result => result.urls['small']);
}

export const fetchCoffeeStores = async () => {
    const photos = await getListofCoffeeStorePhotos();
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.FOURSQUARE_API_KEY
        }
    };

    const response = await fetch(getURLforCoffeeStores("53.90846948670545%2C27.57313137144656", "coffee", 6), options);
    const data = await response.json();
    return data.results.map((result, idx) => {
        const neighborhood = result.location.neighborhood;
        return {
            id: result.fsq_id,
            name: result.name,
            address: result.location.address,
            neighborhood: neighborhood && neighborhood.length > 0 ? neighborhood[0] : "",
            imgUrl: photos.length > 0 ? photos[idx]: null
        }
    });

    //.catch(err => console.error(err));
};