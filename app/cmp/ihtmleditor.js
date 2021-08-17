/*
	import vendor/tinymce/tinymce.min.js
	import vendor/TinyMCETextArea.min.js
*/
this.tinyshow=function(win,doc){
	id=win.frameElement.id.replace('.htmlEditor-inputEl_ifr','');
	win.addEventListener("paste",function(e){
		var dat=e.clipboardData;
		var items=e.clipboardData.items;
		if(items.length>0){
			var clip=items[0];
			if(clip.kind=='file'){
				var file=clip.getAsFile();
				xhr = new XMLHttpRequest();
				xhr.addEventListener('progress', function(e) {
					var done = e.position || e.loaded, total = e.totalSize || e.total;
				}, false);
				if ( xhr.upload ) {
					xhr.upload.onprogress = function(e) {
						var done = e.position || e.loaded, total = e.totalSize || e.total;
					};
				}
				xhr.onreadystatechange = function(e) {
					if (this.readyState == 4){
						if(this.status !== 200){
							if(this.status == 0){
								Ext.create('IToast').toast({msg : 'Batal diUpload.',type : 'error'});
							}else{
								Ext.create('IToast').toast({msg : this.statusText,type : 'error'});
							}
						}else{
							var res=ajaxSuccess(this);
							Ext.getCmp(id+'.htmlEditor').insertText('<img src="'+res.d.folder+res.d.name+'" style="width:300px;" /><br>');
						}
					}
				};
				xhr.open('POST', url + 'fn/file/uploadTinymce', true);
				var formData = new FormData();
				formData.append("file", file);
				formData.append("session", _session_id);
				xhr.send(formData);
			}
		}
		e = e || event;
		e.preventDefault();
	},false);
	win.addEventListener("dragover",function(e){
		e = e || event;
		e.preventDefault();
	},false);
	win.addEventListener("drop",function(e){
		for(var i =0,iLen=e.dataTransfer.items.length; i<iLen;i++){
			var file = e.dataTransfer.items[i].getAsFile();
			if(file != null){
				xhr = new XMLHttpRequest();
				xhr.addEventListener('progress', function(e) {
					var done = e.position || e.loaded, total = e.totalSize || e.total;
				}, false);
				if ( xhr.upload ) {
					xhr.upload.onprogress = function(e) {
						var done = e.position || e.loaded, total = e.totalSize || e.total;
					};
				}
				xhr.onreadystatechange = function(e) {
					if (this.readyState == 4){
						if(this.status !== 200){
							if(this.status == 0){
								Ext.create('IToast').toast({msg : 'Batal diUpload.',type : 'error'});
							}else{
								Ext.create('IToast').toast({msg : this.statusText,type : 'error'});
							}
						}else{
							var res=ajaxSuccess(this);
							Ext.getCmp(id+'.htmlEditor').insertText('<img src="'+res.d.folder+res.d.name+'" style="width:300px;" /><br>');
						}
					}
				};
				xhr.open('POST', url + 'fn/file/uploadTinymce', true);
				var formData = new FormData();
				formData.append("file", file);
				formData.append("session", _session_id);
				xhr.send(formData);
				e = e || event;
				e.preventDefault();
			}
		}
	},false);
}
Ext.define('IHtmlEditor', {
	alias:'widget.ihtmleditor',
	extend : 'Ext.Panel',
	property:{type:'htmleditor',param:0},
	layout:'fit',
	border:false,
	initComponent:function(){
		var $this=this;
		this.items=[
			{
				xtype: 'tinymce_textarea',
				fieldStyle: 'font-family: Courier New; font-size: 12px;',
				style: { border: '0' },
				id: $this.id+'.htmlEditor',
				height: 'auto',
				id_duplikat:'dawdw',
				openFile:function(){},
				settings:{image_list:'string',id_duplikat:'dawdw'},
				tinyMCEConfig:{
					plugins: [
					"advlist autolink lists link image charmap print preview hr anchor pagebreak","searchreplace wordcount visualblocks visualchars code fullscreen",
					"insertdatetime media nonbreaking save table contextmenu directionality","emoticons template paste textcolor"
					],
					toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect | cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | inserttime preview | forecolor backcolor | table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",
					content_css : "vendor/tinymce/contents.css",
					content_js : "vendor/tinymce/contents.js",
					relative_urls : false,
					remove_script_host : false,
					document_base_url : url,
					menubar: false,
					templates: [{title: 'Box Code', description: 'Untuk Script HTML', content: "<div style='background-color: #F4F5F7;border: 1px dashed #CCC; padding: 10px; t-align: left;'>&nbsp;</div><br>"},
					{title: 'Header', description: 'Menambah Header', content: "<br><header>HEADER</header>"},
					{title: 'Footer', description: 'Menambah Footer', content: "<footer>FOOTER</footer><br>"}],
					nonbreaking_force_tab:true,
					toolbar_items_size: 'small'
				}
			}
		];
		$this.setValue=function(val){Ext.getCmp($this.id+'.htmlEditor').setValue(val);};
		$this.getValue=function(){return Ext.getCmp($this.id+'.htmlEditor').getValue();};
		this.callParent(arguments);	
	}
});