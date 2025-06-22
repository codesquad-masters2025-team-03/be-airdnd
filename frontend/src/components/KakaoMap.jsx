import React, { useEffect, useRef } from 'react';

const KakaoMap = ({ accommodations, onBoundsChanged, onMarkerClick }) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        const kakaoMapScript = document.createElement('script');
        kakaoMapScript.async = false;
        kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
        document.head.appendChild(kakaoMapScript);

        const onLoadKakaoAPI = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map');
                const options = {
                    center: new window.kakao.maps.LatLng(37.5073, 127.054),
                    level: 7,
                };
                const map = new window.kakao.maps.Map(container, options);
                mapRef.current = map;

                window.kakao.maps.event.addListener(map, 'dragend', handleBoundsChanged);
                window.kakao.maps.event.addListener(map, 'zoom_changed', handleBoundsChanged);
            });
        };
        
        const handleBoundsChanged = () => {
            if (!mapRef.current || !onBoundsChanged) return;
            const bounds = mapRef.current.getBounds();
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();
            onBoundsChanged({
                sw: { lat: sw.getLat(), lng: sw.getLng() },
                ne: { lat: ne.getLat(), lng: ne.getLng() },
            });
        };

        kakaoMapScript.addEventListener('load', onLoadKakaoAPI);

        return () => {
            document.head.removeChild(kakaoMapScript);
        };
    }, [onBoundsChanged]);

    useEffect(() => {
        if (!mapRef.current) return;

        // 1. Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // 2. Add new markers
        accommodations.forEach((acc) => {
            const markerPosition = new window.kakao.maps.LatLng(acc.latitude, acc.longitude);
            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
            });
            
            window.kakao.maps.event.addListener(marker, 'click', () => {
                if (onMarkerClick) {
                    onMarkerClick(acc.id);
                }
            });

            marker.setMap(mapRef.current);
            markersRef.current.push(marker);
        });
    }, [accommodations, onMarkerClick]);

    return (
        <div
            id="map"
            style={{
                width: '100%',
                height: '100%',
            }}
        ></div>
    );
};

export default KakaoMap;
