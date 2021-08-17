Ext.define('IFileManager', {
	alias:'widget.ifilemanager',
	extend : 'Ext.Panel',
	property:{type:'filemanager'},
	layout:{type:'vbox',align:'stretch'},
	minWidth: 200,
	minHeight:200,
	user:'testing',
	parent:'',
	child:'',
	loadtype:1,
	uploading:false,
	border:false,
	level:0,
	initComponent:function(){
		var $this=this,grid=null,btnUpload=null,file=null,xhr = new XMLHttpRequest(),progress=null,formPanel=null,directory=null;fileName=null;
		$this.getLink=function(){
			var record = grid ? grid.getSelectionModel().getSelection()[0] : null;
			if (!record) {return null;}
			if(record.get('type') != 'FOLDER'){return url+'fn/file?f='+btoa($this.child)+'&n='+record.get('name');}else{return null;}
		};
		var contextMenu = Ext.create('Ext.menu.Menu', {
            width: 200,
            items: [
				{
					text: 'Delete',
					handler: function() {
						var record = grid ? grid.getSelectionModel().getSelection()[0] : null;
						if (!record) {return;}
						Ext.Msg.confirm('Delete Confirm', 'Are you sure for delete this file?', function(answer) {
							if (answer == "yes") {
								grid.setLoading('Delete Folder');
								Ext.Ajax.request({
									url : url + 'fn/file/deleteFile',
									method : 'POST',
									params:{child:$this.child,name:record.get('name')},
									success : function(response) {
										grid.setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S') {grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});}
									},
									failure : function(jqXHR, exception) {grid.setLoading(false);ajaxError(jqXHR, exception,true);}
								});
							}
						});
					}
				},{
					text: 'Rename',
					handler: function() {
						var record = grid ? grid.getSelectionModel().getSelection()[0] : null;
						if (!record) {return;}
						Ext.Msg.prompt('Rename', '', function(btn, text){
							if (btn == 'ok'){
								if(text.trim() !=''){
									grid.setLoading('Rename Folder');
									Ext.Ajax.request({
										url : url + 'fn/file/renameFolder',
										method : 'POST',
										params:{child:$this.child,name:text,before:record.get('name')},
										success : function(response) {
											grid.setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});}
										},
										failure : function(jqXHR, exception) {grid.setLoading(false);ajaxError(jqXHR, exception,true);}
									});
								}
							}
						}, this, false, record.get('name'));
					}
				},{
					text: 'Get Link',
					handler: function() {
						var record = grid ? grid.getSelectionModel().getSelection()[0] : null;
						if (!record) {return;}
						var text=null;
						new Ext.Window({
							layout:'fit',
							title:'Link',
							constrain:true,
							border:false,
							width: 350,
							items:[text=new Ext.form.TextField({selectOnFocus: true,value:url+'fn/file?f='+btoa($this.child)+'&n='+record.get('name')})]
						}).show();
						text.focus();
					}
				}
			]
        });
		$this.abort=function(){
			if($this.uploading==true){
				xhr.abort();
				$this.uploading=false;
				progress.up('panel').hide();
				grid.setLoading(false);
				formPanel.getForm().reset(true);
				grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});
			}
		};
		$this.items=[
			formPanel=new Ext.form.FormPanel({
				fileUpload : true,
				hidden:true,
				items:[
					directory=new Ext.form.TextField({name:'directory',hidden:true}),
					file=new Ext.form.field.File({
						type : 'filefield',
						hidden:true,
						name:'file',
						result:null,
						listeners:{
							change:function(a){
								$this.uploading=true;
								grid.setLoading(true);
								progress.updateText('Uploading...');
								progress.updateProgress(0);
								progress.up('panel').show();
								var file = a.fileInputEl.dom.files[0];
								xhr = new XMLHttpRequest();
								xhr.addEventListener('progress', function(e) {
									var done = e.position || e.loaded, total = e.totalSize || e.total;
									progress.updateProgress((Math.floor(done/total*1000)/10) / 100);
									progress.updateText((Math.floor(done/total*1000)/10) + '%');
								}, false);
								if ( xhr.upload ) {
									xhr.upload.onprogress = function(e) {
										var done = e.position || e.loaded, total = e.totalSize || e.total;
										progress.updateProgress((Math.floor(done/total*1000)/10) / 100);
										if((Math.floor(done/total*1000)/10)<100){
											progress.updateText((iif((done/1024)>1024,((Math.round(((done/1024)/1024)*10)/10)+' Mb'),(Math.round((done/1024)*10)/10)+' Kb'))+'/'+(Math.round(((total/1024)/1024)*10)/10)+' Mb (' + (Math.floor(done/total*1000)/10) + '%)');
										}else{
											progress.updateText('Finishing...');
										}
									};
								}
								xhr.onreadystatechange = function(e) {
									if (this.readyState == 4){
										$this.uploading=false;
										progress.up('panel').hide();
										grid.setLoading(false);
										formPanel.getForm().reset(true);
										grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});
										if(this.status !== 200){//request not initialized
											if(this.status == 0){
												// Ext.create('App.cmp.Toast').toast({msg : 'Batal diUpload.',type : 'error'});
											}else{
												Ext.create('IToast').toast({msg : this.statusText,type : 'error'});
											}
										}else{
											ajaxSuccess(this);
										}
									}
								};
								xhr.open('POST', url + 'fn/file/upload', true);
								var formData = new FormData();
								formData.append("directory", $this.child);
								formData.append("file", file);
								formData.append("session", _session_id);
								xhr.send(formData);
							}
						}
					})
				]
			}),
			grid=new Ext.grid.Panel({
				border: false,
				flex:1,
				viewConfig: {stripeRows: false},
				rowLines : false,
				hideHeaders: true,
				store: Ext.create('Ext.data.Store', {
					autoLoad: false,
					fields: ['parent','child','type','name','id_file'],
					actionMethods: {read: 'GET'},
					proxy: {type: 'ajax',url: url + 'fn/file/getListFile',reader: {type: 'json',root: 'd'}}
				}),
				viewConfig:{listeners:{itemkeydown:function(view,record,item,index,e){
					if(e.keyCode==46){
						var record = grid ? grid.getSelectionModel().getSelection()[0] : null;
						if (!record) {return;}
						if(record.raw.name!=='...' && record.raw.parent !==''){
							Ext.Msg.confirm('Delete Confirm', 'Are you sure for delete this file?', function(answer) {
								if (answer == "yes") {
									grid.setLoading('Delete Folder');
									Ext.Ajax.request({
										url : url + 'fn/file/deleteFile',
										method : 'POST',
										params:{child:$this.child,name:record.get('name')},
										success : function(response) {
											grid.setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});}
										},
										failure : function(jqXHR, exception) {grid.setLoading(false);ajaxError(jqXHR, exception,true);}
									});
								}
							});
						}
					}else if(e.keyCode==13){
						var ridx=record;
						if(ridx.data.type=='FOLDER'){
							grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,child:ridx.data.child,parent:ridx.data.parent},callback:function(){
								$this.parent=ridx.data.parent;
								$this.child=ridx.data.child;
								if(ridx.data.child==''){btnUpload.disable();btnNewFolder.disable();}else{btnUpload.enable();btnNewFolder.enable();}
							}});
						}else{
							Ext.Msg.confirm('Delete Confirm', 'Are you sure for Open/Download this file?', function(answer) {
								if (answer == "yes") {window.open(url+'fn/file?f='+btoa($this.child)+'&n='+ridx.data.name);}
							});
						}
					}
				}}},
				columns: [
					{
						width: 20,
						xtype: 'actioncolumn',
						align: 'right',
						getClass: function(value,metadata,record){
							var type = record.data.type;
								if(type=='FOLDER'){return 'fa fa-folder';
								}else if(type=='TEXT'){return 'fa fa-sticky-note';
								}else if(type=='WORD'){return 'fa fa-file-word-o';
								}else if(type=='EXCEL'){return 'fa fa-file-excel-o';
								}else if(type=='PDF'){return 'fa fa-file-pdf-o';
								}else if(type=='ZIP'){return 'fa fa-file-zip-o';
								}else if(type=='IMAGE'){return 'fa fa-file-photo-o';
								}else if(type=='VIDEO'){return 'fa fa-file-video-o';
								}else if(type=='AUDIO'){return 'fa fa-file-audio-o';
								}else if(type=='APP'){return 'fa fa-windows';
								}else{return 'fa fa-file';}
						}
					},{hidden: true,dataIndex: 'type',
					},{hidden: true,dataIndex: 'child',
					},{hidden: true,dataIndex: 'parent',
					},{hidden: true,dataIndex: 'id_file'
					},{text: "File",flex:1,dataIndex: 'name'}
				],
				listeners:{
					itemdblclick: function (sm, ridx, cidx) {
						if(ridx.data.type=='FOLDER'){
							grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,child:ridx.data.child,parent:ridx.data.parent},callback:function(){
								$this.parent=ridx.data.parent;
								$this.child=ridx.data.child;
								if(ridx.data.child==''){btnUpload.disable();btnNewFolder.disable();}else{btnUpload.enable();btnNewFolder.enable();}
							}});
						}else{
							Ext.Msg.confirm('Delete Confirm', 'Are you sure for Open/Download this file?', function(answer) {
								if (answer == "yes") {window.open(url+'fn/file?f='+btoa($this.child)+'&n='+ridx.data.name);}
							});
						}
					}
				},
				tbar:[
					btnUpload=new Ext.Button({
						text:'Upload',
						iconCls:'fa fa-upload',
						disabled:true,
						handler:function(){file.fileInputEl.dom.click();}
					}),
					new Ext.Button({
						text:'Refresh',
						iconCls:'fa fa-refresh',
						handler:function(){grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});}
					}),
					btnNewFolder=new Ext.Button({
						text:'New Folder',
						iconCls:'fa fa-folder',
						disabled:true,
						handler:function(){
							Ext.Msg.prompt('New Folder', 'Enter Folder Name:', function(btn, text){
								if (btn == 'ok'){
									if(text.trim() !=''){
										grid.setLoading('Create Folder');
										Ext.Ajax.request({
											url : url + 'fn/file/newFolder',
											method : 'POST',
											params:{child:$this.child,name:text},
											success : function(response) {
												grid.setLoading(false);
												var r = ajaxSuccess(response);
												if (r.r == 'S') {grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});}
											},
											failure : function(jqXHR, exception) {grid.setLoading(false);ajaxError(jqXHR, exception,true);}
										});
									}
								}
							});
						}
					})
				]
			}),{
				xtype:'panel',
				height: 20,
				border:false,
				hidden:true,
				layout:{
					type:'hbox',
					align:'stretch'
				},
				items:[
					progress=Ext.create('Ext.ProgressBar', {
						text: 'Uploading...',
						border:false,
						flex:1,
					}),{
						xtype:'button',
						iconCls:'fa fa-close',
						handler:function(){
							$this.abort();
						}
					}
				]
			}
			
		];
		grid.on("itemcontextmenu", function(grid, record, item, index, e) {
            e.stopEvent();
			if(record.data.parent==''){
				contextMenu.items.items[0].disable();
				contextMenu.items.items[1].disable();
				contextMenu.items.items[2].disable();
			}else{
				contextMenu.items.items[0].enable();
				contextMenu.items.items[1].enable();
				contextMenu.items.items[2].enable();
				if(record.data.type=='FOLDER'){contextMenu.items.items[2].disable();}
			}
            contextMenu.showAt(e.getXY());
        });
		this.callParent(arguments);
		grid.getStore().load({params:{user:$this.user,loadtype:$this.loadtype,parent:$this.parent,child:$this.child}});
	}
});