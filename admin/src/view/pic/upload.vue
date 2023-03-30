<template>
<div>
	<el-form label-width="80px"
	         label-position="left"
	         size="large">
		<el-form-item label="图片">
			<el-upload v-model:file-list="files"
			           action="#"
			           list-type="picture-card"
			           :auto-upload="false">
				<icons name="plus"></icons>
				<template #file="scope">
					<div>
						<img class="el-upload-list__item-thumbnail"
						     :src="scope.file.url"
						     alt=""/>
						<span class="el-upload-list__item-actions">
							<span class="el-upload-list__item-preview"
							      @click="handlePictureCardPreview(scope.file)">
								<icons name="zoom-in"></icons>
							</span>
							<span v-if="!disabled"
							      class="el-upload-list__item-delete"
							      @click="handleRemove(scope.file)">
								<icons name="delete"></icons>
							</span>
						</span>
					</div>
				</template>
			</el-upload>
		</el-form-item>
		<el-form-item label="标签">
			<el-input  v-model="data.tags"
			           type="textarea"
			           resize="none"
			           placeholder="图片标签"
			           :rows="4"></el-input>
		</el-form-item>
		<el-form-item label="描述">
			<el-input  v-model="data.desc"
			           type="textarea"
			           resize="none"
			           placeholder="图片描述"
			           :rows="4"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary"
			           @click="submit">保存</el-button>
		</el-form-item>
	</el-form>
	<el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
</div>
</template>

<script setup>
import {ref, inject} from 'vue';

const data = ref({
		desc: ''
		, tags: ''
	})
	, files = ref([])
	, $hashParams = inject('$hashParams')
	, albumId = ref( $hashParams().id )
	, id = ref(false)
	, $alert = inject('$alert')
	, $midway = inject('$midway')
	;

const dialogImageUrl = ref('')
	, dialogVisible = ref(false)
	, disabled = ref(false)
    ;

function handleRemove(file){
	let t = files.value
		, index = t.indexOf( file )
		;

	t.splice(index, 1);
}

function handlePictureCardPreview(file){
	dialogImageUrl.value = file.url;
	dialogVisible.value = true
}

function submit(){
	if( !files.value.length ){
		return ;
	}

	if( id.value ){
		return ;
	}

	Promise.all( files.value.map((file)=>{
		return new Promise((resolve)=>{
			let img = document.createElement('img')
				;

			img.onload = (e)=>{
				let { width
					, height } = e.target
					;

				resolve({
					file
					, width
					, height
					, ...data.value
				});
			}
			img.src = file.url;
		});
	}) ).then((data)=>{
		let formData = new FormData()
			, execute
			;

		if( data.length > 1 ){
			let info = []
				;

			data.forEach(({file, width, height, desc, tags})=>{
				formData.append('images', file.raw);

				info.push({
					width
					, height
					, desc
					, tags
					, albumId: albumId.value || undefined
				});
			});

			formData.append('info', JSON.stringify( info ));

			execute = $midway.post('/image/uploads', {
				data: formData
			});
		}
		else{
			data = data[0];

			let { file
				, width
				, height
				, desc
				, tags } = data
				;

			formData.append('image', file.raw);
			formData.append('width', width);
			formData.append('height', height);
			formData.append('desc', desc);
			formData.append('tags', tags);

			if( albumId.value ){
				formData.append('albumId', albumId.value);
			}

			execute = $midway.post('/image/upload', {
				data: formData
			});
		}

		execute.then(({code})=>{
			if( code === 0 ){
				if( !id.value ){
					id.value = true;
				}

				$alert('保存成功', {
					type: 'success'
				});
			}
		});
	});
}
</script>
<script>
export default {
	name: 'picUpload'
};
</script>