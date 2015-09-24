'use strict';

var defaultsNav = [{
	href: '../editor/'
	, icon: 'editor'
}, {
	href: '../document/'
	, icon: 'document'
}, {
	href: '../bower/'
	, icon: 'bower'
}, {
	href: '../reader/'
	, icon: 'rss'
}, {
	href: '../reader/bookmark'
	, icon: 'bookmark'
}, {
	href: '../reader/favorite'
	, icon: 'star'
}];

module.exports = function(current){
	return defaultsNav.map(function(d){
		d.on = d.icon === current;

		return d;
	});
};