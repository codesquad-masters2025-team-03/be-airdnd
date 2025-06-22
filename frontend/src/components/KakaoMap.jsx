import React, {useEffect, useRef} from 'react';

const KakaoMap = ({accommodations, onBoundsChanged, onMarkerClick}) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        const initMap = () => {
            window.kakao.maps.load(() => {
                if (!mapContainerRef.current) return;

                const options = {
                    center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 서울 중심
                    level: 7,
                };
                const map = new window.kakao.maps.Map(mapContainerRef.current, options);
                mapRef.current = map;

                const handleBoundsChanged = () => {
                    if (!mapRef.current || !onBoundsChanged) return;
                    const bounds = mapRef.current.getBounds();
                    const sw = bounds.getSouthWest();
                    const ne = bounds.getNorthEast();
                    onBoundsChanged({
                        sw: {lat: sw.getLat(), lng: sw.getLng()},
                        ne: {lat: ne.getLat(), lng: ne.getLng()},
                    });
                };

                window.kakao.maps.event.addListener(map, 'dragend', handleBoundsChanged);
                window.kakao.maps.event.addListener(map, 'zoom_changed', handleBoundsChanged);
            });
        };

        const scriptUrl = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
        const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                initMap();
            };
        } else if (window.kakao && window.kakao.maps) {
            initMap();
        }

    }, [onBoundsChanged]);

    useEffect(() => {
        if (!mapRef.current || !window.kakao) return;

        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        if (accommodations && accommodations.length > 0) {
            const {kakao} = window;
            accommodations.forEach((acc) => {
                if (acc.latitude && acc.longitude) {
                    const markerPosition = new kakao.maps.LatLng(acc.latitude, acc.longitude);
                    const marker = new kakao.maps.Marker({
                        position: markerPosition,
                    });

                    kakao.maps.event.addListener(marker, 'click', () => {
                        if (onMarkerClick) {
                            onMarkerClick(acc.id);
                        }
                    });

                    marker.setMap(mapRef.current);
                    markersRef.current.push(marker);
                }
            });

            // Fit map to markers
            const bounds = new window.kakao.maps.LatLngBounds();
            accommodations.forEach(acc => {
                if (acc.latitude && acc.longitude) {
                    bounds.extend(new window.kakao.maps.LatLng(acc.latitude, acc.longitude));
                }
            });
            if (!bounds.isEmpty()) {
                mapRef.current.setBounds(bounds);
            }
        }
    }, [accommodations, onMarkerClick]);

    return (
        <div
            ref={mapContainerRef}
            style={{
                width: '100%',
                height: '100%',
            }}
        ></div>
    );
};

export default KakaoMap;
