import {useEffect, useRef} from 'react';
import maple               from 'cyan-maple';

function LoadMore({next}){
	const ref = useRef(null)
		;

	useEffect(()=>{
		const el = ref.current
			;

		maple.listener.on(el, 'intersectionObserver', (e, entry)=>{
			if( entry.isIntersecting ){
				next();
			}
		});

		return ()=>{
			maple.listener.off(el, 'intersectionObserver');
		};
	});

	return (<div className="loading"
	             ref={ref}>
		<div className="loading-chasing"></div>
	</div>);
}

export default LoadMore;