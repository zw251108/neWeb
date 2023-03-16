import {defineConfig} from 'vite';
import vue            from '@vitejs/plugin-vue';
import path           from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	root: './admin'
	, plugins: [vue()]
	, server: {
		// host: 'localmiddleground.test.66buy.com.cn'
		// ,
		port: '3010'
	}
	, resolve: {
		alias: {
			// 'cyan-maple': path.resolve(__dirname, 'cyan-maple/src')
			mgcc: path.resolve(path.resolve(), 'admin/mgcc')
		}
	}
});