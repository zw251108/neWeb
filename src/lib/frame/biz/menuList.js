'use strict';

import device   from 'device';

const MENU_ITEMS = [{
		name: 'message'
		, scp: 'mr.noti'
	}, {
		name: 'index'
		, scp: 'mr.thome'
	}, {
		name: 'shoppingCart'
		, scp: 'mr.tscar'
	}, {
		name: 'share'
		, scp: 'mr.tshare'

	}]
	;

let menuIndex = (()=>{
		return MENU_ITEMS.reduce((all, d, i)=>{
			all[d.name] = i;

			return all;
		}, {});
	})()

	/**
	 * @param   {...String}
	 * */
	, createMenuList = function(){
		let argv
			, argc = arguments.length
			;

		if( argc > 0 ){
			argv = [].slice.call( arguments );

			return argv.reduce((all, d)=>{
				if( d in menuIndex ){
					all.push( MENU_ITEMS[menuIndex[d]] );
				}

				return all;
			}, []);
		}
		else{
			return [];
		}
	}
	;

export default createMenuList;