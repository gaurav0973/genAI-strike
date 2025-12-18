// tool : cryptoCurrency
export async function cryptoCurrency({coin}){
    const responce = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`);
    const data = await responce.json()
    // console.log(data);
    return data;

}

// cryptoCurrency({coin:"bitcoin"});



export async function weatherInformation({city}){
    const responce = await fetch(`http://api.weatherapi.com/v1/current.json?key=0d2d216596054f078c985107251812&q=${city}&aqi=no`)
    const data = await responce.json()
    // console.log(data);
    return data;
}

// weatherInformation({city:"New Delhi"});
