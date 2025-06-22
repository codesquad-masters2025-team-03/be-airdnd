import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const PriceContainer = styled.div`
    padding: 16px;
    width: 400px;
    margin: 0 auto;
`;

const PriceRangeLabel = styled.div`
    text-align: center;
    margin-bottom: 20px;
    font-size: 16px;
`;

const Histogram = styled.div`
    display: flex;
    align-items: flex-end;
    height: 100px;
    margin-bottom: 20px;
`;

const Bar = styled.div`
    flex-grow: 1;
    background-color: #f0f0f0;
    margin: 0 1px;
    background-color: ${({isIncluded}) => isIncluded ? '#ccc' : '#eee'};
`;

// Mock API call
const fetchPriceData = async (filters) => {
    console.log("Fetching price data with filters:", filters);
    // In a real app, you would make a call like this:
    // const { data } = await axios.get('/api/accommodations/price-range', { params: filters });
    // return data.data;

    // Mocked response
    return Promise.resolve({
        minValue: 10000,
        maxValue: 500000,
        priceHistogram: Array.from({length: 50}, () => Math.floor(Math.random() * 100)),
    });
};


const PriceDropdown = ({priceRange, setPriceRange, location, dates, guests}) => {
    const [apiPriceInfo, setApiPriceInfo] = useState({minValue: 0, maxValue: 1000000, priceHistogram: []});

    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const totalGuests = guests.adults + guests.children + guests.infants;
        
        const filters = {
            location: location || "서울",
            checkin: (dates.startDate || today).toISOString().split('T')[0],
            checkout: (dates.endDate || tomorrow).toISOString().split('T')[0],
            guests: totalGuests > 0 ? totalGuests : 1,
        };
        
        fetchPriceData(filters).then(data => {
            setApiPriceInfo(data);
            if(priceRange.min === 0 && priceRange.max === 1000000) { // Only set initial price from API
                setPriceRange({min: data.minValue, max: data.maxValue});
            }
        });
    }, [location, dates, guests, setPriceRange]);

    const maxHistValue = Math.max(...apiPriceInfo.priceHistogram, 1);

    return (
        <PriceContainer>
            <PriceRangeLabel>
                ₩{priceRange.min.toLocaleString()} - ₩{priceRange.max.toLocaleString()}+
            </PriceRangeLabel>

            <Histogram>
                {apiPriceInfo.priceHistogram.map((value, index) => {
                    const barMinPrice = apiPriceInfo.minValue + (index / apiPriceInfo.priceHistogram.length) * (apiPriceInfo.maxValue - apiPriceInfo.minValue);
                    const barMaxPrice = apiPriceInfo.minValue + ((index + 1) / apiPriceInfo.priceHistogram.length) * (apiPriceInfo.maxValue - apiPriceInfo.minValue);
                    const isIncluded = barMinPrice >= priceRange.min && barMaxPrice <= priceRange.max;
                    return (
                        <Bar key={index} style={{height: `${(value / maxHistValue) * 100}%`}} isIncluded={isIncluded}/>
                    );
                })}
            </Histogram>

            <Slider
                range
                min={apiPriceInfo.minValue}
                max={apiPriceInfo.maxValue}
                value={[priceRange.min, priceRange.max]}
                onChange={(newRange) => setPriceRange({min: newRange[0], max: newRange[1]})}
                allowCross={false}
            />
        </PriceContainer>
    );
};

export default PriceDropdown; 
