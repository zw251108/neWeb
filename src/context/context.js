import React from 'react';
import maple from 'cyan-maple';

maple.setDefaultDI();
maple.useAxios();

const AppContext = React.createContext( maple )
	;

export default AppContext;