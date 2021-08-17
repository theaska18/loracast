/*
	import cmp.ifotoupload
	import cmp.iconfig
	import cmp.icombobox
	import cmp.icomboquery
	import cmp.ipanel
	import cmp.itablegrid
	import cmp.iinput
	import cmp.itextarea
	import cmp.idynamicoption
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('TENANT.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('TENANT.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('TENANT.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('TENANT.btnAdd');
			}
		}
	]
});
Ext.Panel({
	id : 'TENANT.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'TENANT.search',
			modal:false,
			title:'Penyewa - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('TENANT.search.btnClose');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('TENANT.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('TENANT.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('TENANT.search.f1').focus();
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('search');
				}
			},
			fbar: [
				{
					text: 'Cari',
					tooltip:'Cari <b>[Ctrl+s]</b>',
					iconCls:'fa fa-search fa-green',
					id:'TENANT.search.btnSearch',
					handler: function() {
						Ext.getCmp('TENANT.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'TENANT.search.btnReset',
					handler: function() {
						Ext.getCmp('TENANT.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					id:'TENANT.search.btnClose',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('TENANT.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'TENANT.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f6',
							fieldLabel:'Kode Penyewa',
							id:'TENANT.search.f6',
							database:{
								table:'app_tenant',
								field:'tenant_code',
								separator:'like'
							},
							press:{
								enter:function(){
									_click('TENANT.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f1',
							id:'TENANT.search.f1',
							database:{
								table:'app_tenant',
								field:'tenant_name',
								separator:'like'
							},
							fieldLabel:'Nama Penyewa',
							press:{
								enter:function(){
									_click('TENANT.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f2',
							id:'TENANT.search.f2',
							fieldLabel:'Alamat',
							database:{
								field:'address',
								table:'app_tenant',
								separator:'like'
							},
							press:{
								enter:function(){
									_click('TENANT.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f3',
							fieldLabel:'Kota',
							database:{
								field:'city',
								table:'app_tenant',
								separator:'like'
							},
							id:'TENANT.search.f3',
							press:{
								enter:function(){
									_click('TENANT.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f4',
							fieldLabel:'Telepon',
							database:{
								field:'phone_number',
								table:'app_tenant',
								separator:'like'
							},
							id:'TENANT.search.f4',
							press:{
								enter:function(){
									_click('TENANT.search.btnSearch');
								}
							}
						},{
							xtype:'iparameter',
							id : 'TENANT.search.f5',
							parameter:'ACTIVE_FLAG',
							database:{
								table:'app_TENANT',
								field:'M.active_flag',
								type:'active'
							},
							name : 'f5',
							fieldLabel:'Aktif',
							width: 200,
							press:{
								enter:function(){
									_click('TENANT.search.btnSearch');
								}
							}
						}
					]
				}
			]
		},{
			xtype:'itablegrid',
			id:'TENANT.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('TENANT.search.panel')._parameter();
				}else{
					var obj={};
					obj['app_tenant']={};
					obj['app_tenant'][Ext.getCmp('TENANT.dropdown').getValue()]={
						value:Ext.getCmp('TENANT.text').getValue(),
						separator:'like'
					};
					obj['app_tenant']['active_flag']={
						value:true,
						type:'boolean',
						separator:'='
					}
					return JSON.stringify(obj);
				}
			},
			database:{
				table:'app_tenant'
			},
			fn:{
				delete:function(a){
					_access('TENANT_DELETE',function(){
						Ext.getCmp('TENANT.confirm').confirm({
							msg : "Apakah Akan Menghapus Data Penyewa '"+a.tenant_name+"' ?",
							allow : 'TENANT.delete',
							onY : function() {
								Ext.Ajax.request({
									url : _url('TENANT','delete'),
									method : 'POST',
									before:function(){
										Ext.getCmp('TENANT.list').setLoading(true);
									},
									params : {
										i : a.tenant_id
									},
									success : function(response) {
										Ext.getCmp('TENANT.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											// socket.send('USERMODULE','TENANT','ADD');
											Ext.getCmp('TENANT.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('TENANT.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					})
				},
				update:function(a){
					_access('TENANT_UPDATE',function(){
						Ext.getCmp('TENANT.list').hide();
						// Ext.getCmp('TENANT.input').setTitle('Penyewa - Edit');
						Ext.getCmp('TENANT.input.p').setValue('UPDATE');
						Ext.getCmp('TENANT.input').show();
						Ext.getCmp('TENANT.input.i').setValue(a.tenant_id);
						Ext.getCmp('TENANT.input.panel')._load();
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('TENANT.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('TENANT.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Tenant</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
				xtype:'iconfig',
				id:'TENANT.config',
				menuCode:'TENANT',
				code:[
					iif(_access('TENANT_config_SEQUENCE')==false,'SEQUENCE',null),
					iif(_access('TENANT_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
				]
			},'->',
				{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'TENANT.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('TENANT.input.panel').qReset();
						Ext.getCmp('TENANT.input.f7').setNull();
						Ext.getCmp('TENANT.input').closing = false;
						Ext.getCmp('TENANT.list').hide();
						Ext.getCmp('TENANT.input').show();
						Ext.getCmp('TENANT.input.p').setValue('ADD');
						// Ext.getCmp('TENANT.input').setTitle('Penyewa - Tambah');
						if(getSetting('TENANT','SEQUENCE')=='Y'){
							Ext.getCmp('TENANT.input.f9').setReadOnly(true);
							Ext.getCmp('TENANT.input.f9').database.sequence=getSetting('TENANT','SEQUENCE_CODE');
							Ext.getCmp('TENANT.input.f1').focus();
						}else{
							Ext.getCmp('TENANT.input.f9').setReadOnly(false);
							Ext.getCmp('TENANT.input.f9').database.sequence='';
							Ext.getCmp('TENANT.input.f9').focus();
						}
						Ext.getCmp('TENANT.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'TENANT.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'TENANT.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'tenant_name',
							data:[
								{id:'tenant_code',text:'Kode Penyewa'},
								{id:'tenant_name',text:'Nama Penyewa'},
								{id:'address',text:'Alamat'},
								{id:'city',text:'Kota'},
								{id:'phone_number',text:'Telepon'}
							],
							width: 150,
							press:{
								enter:function(){
									_click('TENANT.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							margin:false,
							emptyText:'Pencarian',
							tooltip:'Pencarian [Ctrl+f]',
							id:'TENANT.text',
							press:{
								enter:function(){
									_click('TENANT.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							id:'TENANT.btnSearch',
							handler : function(a) {
								Ext.getCmp('TENANT.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'TENANT.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('TENANT.search').show();
						Ext.getCmp('TENANT.search.f6').focus();
					}
				}
			],
			columns:[
				{xtype:'rownumberer'},
				{ hidden:true,dataIndex: 'tenant_id',database:{field:'tenant_id'} },
				{ text: 'Kode',width: 120,dataIndex: 'tenant_code',database:{field:'tenant_code'}  },
				{ text: 'Nama Penyewa',width: 200, dataIndex: 'tenant_name',database:{field:'tenant_name'}  },
				{ text: 'Alamat',flex: 1,minWidth:200,dataIndex: 'address',database:{field:'address'}  },
				{ text: 'Kota',width: 100,align:'center', dataIndex:'city' ,database:{field:'city'}  },
				{ text: 'Telepon',width: 100,align:'center', dataIndex: 'phone_number' ,database:{field:'phone_number'}  },
				{ xtype:'active',dataIndex: 'active_flag',database:{field:'M.active_flag'}},
				{
					text: 'Akses',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-key',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						_access('TENANT_MENU',function(){
							Ext.getCmp('TENANT.inputMenu.id').setValue(record.raw.tenant_id);
							Ext.getCmp('TENANT.input.setting').tenant_id=record.raw.tenant_id;
							Ext.getCmp('TENANT.inputMenu.f1').setValue(null);
							Ext.getCmp('TENANT.inputMenu.TENANTCode').setValue(record.raw.tenant_code);
							Ext.Ajax.request({
								url : url + 'cmd?m=TENANT&f=getForMenu',
								method : 'GET',
								before:function(){
									Ext.getCmp('TENANT.list').setLoading(true);
								},
								params : {
									i : record.raw.tenant_id,
									group:Ext.getCmp('TENANT.inputMenu.f1').getValue()
								},
								success : function(response) {
									Ext.getCmp('TENANT.list').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										var treeNode = Ext.getCmp('TENANT.input.tree').getRootNode();
										treeNode.removeAll();
										treeNode.appendChild(r.d);
										treeNode.expandChildren(true);
										Ext.getCmp('TENANT.list').hide();
										Ext.getCmp('TENANT.inputMenu').show();
										Ext.getCmp('TENANT.input.menuId').setValue('');
										Ext.getCmp('TENANT.input.textMenu').setValue('');
										Ext.getCmp('TENANT.input.setting').menu_code='';
										Ext.getCmp('TENANT.input.setting').refresh();
										Ext.getCmp('TENANT.input.akses').refresh();
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('TENANT.list').setLoading(false);
									ajaxError(jqXHR, exception,true);
								}
							});
						});
					}
				},{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('TENANT.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('TENANT.list').fn.delete(record.data);
					}
				}
			]
		},{
			id:'TENANT.input',
			hidden:true,
			border:false,
			layout:'fit',
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('TENANT.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('TENANT.input.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('input');
				}
			},
			tbar: [
				{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-chevron-left fa-red',
					id:'TENANT.input.btnClose',
					handler: function() {
						var req=Ext.getCmp('TENANT.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('TENANT.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'TENANT.close',
								onY : function() {
									Ext.getCmp('TENANT.input').hide();
									Ext.getCmp('TENANT.list').show();
								}
							});
						}else{
							Ext.getCmp('TENANT.input').hide();
							Ext.getCmp('TENANT.list').show();
						}
					}
				},'->','<b>Input Penyewa</b>','->',{
					text: 'Simpan',
					id:'TENANT.input.btnSave',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('TENANT.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('TENANT.input.panel')._save(function(){
								Ext.getCmp('TENANT.input').hide();
								Ext.getCmp('TENANT.list').show();
								Ext.getCmp('TENANT.list').refresh();
							});
						else{
							if(Ext.getCmp('TENANT.input.p').getValue()=='ADD'){
								Ext.create('IToast').toast({msg : 'Periksa Kembali Datanya.',type : 'warning'});
							}else{
								Ext.create('IToast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
							}
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'TENANT.input.panel',
					layout:'column',
					submit:'TENANT.input.btnSave',
					database:{
						command:{
							app_tenant:{
								primary:'tenant_id',
								unique:[
									{
										field:'tenant_code',
										name:'Kode Penyewa'
									}
								]
							}
						}
					},
					items:[
						{
							xtype:'form',
							columnWidth: .33,
							minWidth:350,
							border:false,
							cls:'i-transparent',
							items:[
								{
									xtype:'ihiddenfield',
									name:'p',
									id:'TENANT.input.p'
								},{
									xtype:'ihiddenfield',
									name:'i',
									database:{
										table:'app_tenant',
										field:'tenant_id',
										type:'double'
									},
									id:'TENANT.input.i'
								},{
									xtype:'itextfield',
									maxLength:32,
									name:'f9',
									submit:'TENANT.input.panel',
									fieldLabel:'Kode Penyewa',
									database:{
										table:'app_tenant',
										field:'tenant_code'
									},
									id:'TENANT.input.f9',
									allowBlank: false,
									property:{
										upper:true,
										space:false
									}
								},{
									xtype:'itextfield',
									maxLength:64,
									submit:'TENANT.input.panel',
									name:'f1',
									fieldLabel:'Nama Penyewa',
									database:{
										table:'app_tenant',
										field:'tenant_name'
									},
									id:'TENANT.input.f1',
									allowBlank: false,
									property:{
										dynamic:true
									}
								},{
									xtype:'idynamicoption',
									name:'f2',
									submit:'TENANT.input.panel',
									database:{
										table:'app_tenant',
										field:'city',
										option:'DYNAMIC_CITY'
									},
									type:'DYNAMIC_CITY',
									id:'TENANT.input.f2',
									fieldLabel:'Kota',
									allowBlank : false
								},{
									xtype:'itextarea',
									name:'f3',
									submit:'TENANT.input.panel',
									fieldLabel:'Deskripsi',
									maxLength:128,
									database:{
										table:'app_tenant',
										field:'tenant_desc'
									},
									id:'TENANT.input.f3'
								},{
									xtype:'itextarea',
									name:'f4',
									submit:'TENANT.input.panel',
									fieldLabel:'Alamat',
									database:{
										table:'app_tenant',
										field:'address'
									},
									maxLength:256,
									allowBlank: false,
									id:'TENANT.input.f4'
								},{
									xtype:'iinput',
									label :'Masa Berlaku',
									items : [
										{
											xtype:'icheckbox',
											name:'f11',
											checked:false,
											submit:'TENANT.input.panel',
											margin:false,
											database:{
												table:'app_tenant',
												field:'due_flag'
											},
											id:'TENANT.input.f11',
											listeners:{
												change:function(a){
													if(a.getValue()==true){
														Ext.getCmp('TENANT.input.f10').setReadOnly(false);
														Ext.getCmp('TENANT.input.f10').setValue(null);
													}else{
														Ext.getCmp('TENANT.input.f10').setReadOnly(true);
														Ext.getCmp('TENANT.input.f10').setValue(null);
													}
												}
											}
										},{
											xtype:'displayfield',
											value:'&nbsp; Belaku S/d&nbsp;',
											margin:false,
										},{
											xtype:'idatefield',
											id : 'TENANT.input.f10',
											name : 'f10',
											submit:'TENANT.input.panel',
											margin:false,
											readOnly:true,
											database:{
												table:'app_tenant',
												field:'due_on'
											},
											emptyText: 'Berlaku'
										}
									]
								},{
									xtype:'itextfield',
									maxLength:128,
									submit:'TENANT.input.panel',
									name:'f12',
									fieldLabel:'Nama Aplikasi',
									database:{
										table:'app_tenant',
										field:'app_name'
									},
									id:'TENANT.input.f12',
									allowBlank: false,
									property:{
										dynamic:true
									}
								}
							]
						},{
							xtype:'form',
							columnWidth: .33,
							minWidth:350,
							border:false,
							cls:'i-transparent',
							items:[
								{
									xtype:'itextfield',
									name:'f5',
									submit:'TENANT.input.panel',
									fieldLabel:'No. Telepon',
									maxLength:16,
									database:{
										table:'app_tenant',
										field:'phone_number'
									},
									allowBlank: false,
									id:'TENANT.input.f5',
								},{
									xtype:'itextfield',
									name:'f6',
									submit:'TENANT.input.panel',
									fieldLabel:'No. Fax',
									maxLength:16,
									database:{
										table:'app_tenant',
										field:'fax_number'
									},
									id:'TENANT.input.f6'
								},{
									xtype:'iinput',
									label:'Logo',
									items:[
										{
											xtype:'ifotoupload',
											name: 'f7',
											id:'TENANT.input.f7',
											database:{
												table:'app_tenant',
												field:'logo'
											}
										}
									]
								},{
									xtype:'icheckbox',
									name:'f8',
									submit:'TENANT.input.panel',
									fieldLabel:'Aktif',
									checked:true,
									database:{
										table:'app_tenant',
										field:'active_flag'
									},
									id:'TENANT.input.f8'
								}
							]
						}
					]
				}
			]
		},{
			id:'TENANT.inputMenu',
			// title:'Tenant - Menu',
			hidden:true,
			border:false,
			autoScroll :true,
			listeners:{
				show:function(){
					shortcut.set({
						code:'inputMenu',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('TENANT.inputMenu.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('inputMenu');
				}
			},
			tbar:[
				{
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'TENANT.inputMenu.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						Ext.getCmp('TENANT.inputMenu').hide();
						Ext.getCmp('TENANT.list').show();
					}
				},'->','<b>Akses Penyewa</b>','->'
			],
			layout:{
				type:'hbox',
				align:'stretch'
			},
			items:[
				{
					xtype:'ihiddenfield',
					id:'TENANT.inputMenu.TENANTCode'
				},{
					xtype:'ihiddenfield',
					id:'TENANT.inputMenu.id'
				},{
					xtype:'treepanel',
					
					border:false,
					width:250,
					autoScroll :true,
					root : {
						expanded : true
					},
					id : 'TENANT.input.tree',
					store: Ext.create('Ext.data.TreeStore', {
						root: {
							expanded: true,
							children: []
						}
					}),
					tbar:[
						{
							xtype:'icomboquery',
							id : 'TENANT.inputMenu.f1',
							query:'SELECT group_id as id,group_name AS text FROM app_menu_group WHERE active_flag=1 AND group_id in(select distinct(group_id) from app_menu) ORDER by group_name',
							name : 'f1',
							emptyText: 'Grup Menu',
							width: 230,
							listeners:{
								change:function(){
									Ext.Ajax.request({
										url : url + 'cmd?m=TENANT&f=getForMenu',
										method : 'GET',
										before:function(){
											Ext.getCmp('TENANT.list').setLoading(true);
										},
										params : {
											i : Ext.getCmp('TENANT.inputMenu.id').getValue(),
											group:Ext.getCmp('TENANT.inputMenu.f1').getValue()
										},
										success : function(response) {
											Ext.getCmp('TENANT.list').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												var treeNode = Ext.getCmp('TENANT.input.tree').getRootNode();
												treeNode.removeAll();
												treeNode.appendChild(r.d);
												treeNode.expandChildren(true);
												Ext.getCmp('TENANT.inputMenu').show();
												Ext.getCmp('TENANT.input.menuId').setValue('');
												Ext.getCmp('TENANT.input.textMenu').setValue('');
												Ext.getCmp('TENANT.input.setting').menu_code='';
												Ext.getCmp('TENANT.input.setting').refresh();
												Ext.getCmp('TENANT.input.akses').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('TENANT.list').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							},
							margin:false,
						}
					],
					rootVisible: false,
					listeners: {
						itemclick:function(a,r){
							if(_access('TENANT_setting')==false && r.raw.type=='MENU'){
								Ext.getCmp('TENANT.input.menuId').setValue(r.raw.f1);
								Ext.getCmp('TENANT.input.textMenu').setValue(r.raw.text);
								Ext.getCmp('TENANT.input.setting').menu_code=r.raw.f2;
								Ext.getCmp('TENANT.input.setting').refresh();
								Ext.getCmp('TENANT.input.akses').refresh();
							}
						},
						checkchange : function(node, checked, opts) {
							var arrA=[];
							var arrAc=[];
							var arrB=[];
							var arrBc=[];
							if(node.raw.type!='ACCESS'){
								arrA.push(node.raw.f1);
								arrAc.push(node.data.checked);
							}else{
								arrB.push(node.raw.f1);
								arrBc.push(node.data.checked);
							}
							function clearNodeSelection(node){
								leafNode = node.raw.leaf;
								if(!leafNode)
									node.cascadeBy(function(node) {
										if(node.data.checked==true){
											if(node.raw.type!='ACCESS'){
												arrA.push(node.raw.f1);
												arrAc.push(false);
											}else{
												arrB.push(node.raw.f1);
												arrBc.push(false);
											}
										}
										node.set('checked', false);
									})
							}
							if(!checked)
								clearNodeSelection(node);
							function selectParentNodes(node){
								var parentNode = node.parentNode;
								if(parentNode && node.id != 'root'){
									if(parentNode.data.checked==false){
										if(parentNode.raw.type!='ACCESS'){
											arrA.push(parentNode.raw.f1);
											arrAc.push(true);
										}else{
											arrB.push(parentNode.raw.f1);
											arrBc.push(true);
										}
									}
									parentNode.set('checked', true);
									selectParentNodes(parentNode);
								}
							}
							selectParentNodes(node);
							var a={};
							a['i']=Ext.getCmp('TENANT.inputMenu.id').getValue();
							a['f1']=Ext.encode(arrA);
							a['f2']=Ext.encode(arrB);
							a['f3']=Ext.encode(arrAc);
							a['f4']=Ext.encode(arrBc);
							Ext.Ajax.request({
								url : url + 'cmd?m=TENANT&f=saveMenu',
								method : 'POST',
								params:a,
								success : function(response) {
									var r =ajaxSuccess(response);
								},
								failure : function(jqXHR, exception) {
									ajaxError(jqXHR, exception,true);
								}
							});
						}
					}
				},{
					xtype:'itable',
					autoRefresh:false,
					minWidth: 200,
					flex:1,
					hideHeaders: true,
					title:'Sub Akses',
					hideBbar:true,
					id : 'TENANT.input.akses',
					params:function(bo){
						var arr={};
						arr['tenant_id']=Ext.getCmp('TENANT.inputMenu.id').getValue();
						arr['menu_id']=Ext.getCmp('TENANT.input.menuId').getValue();
						return arr;
					},
					url:url + 'cmd?m=TENANT&f=getListAccess',
					result:function(response){
						return {list:response.d,total:response.t};
					},
					columns:[
						{ hidden:true,dataIndex: 'i' },
						{ xtype: 'checkcolumn',
							header: '&nbsp;',
							dataIndex: 'f1',
							width: 40,
							editor: {
								xtype: 'checkbox',
								cls: 'x-grid-checkheader-editor'
							},listeners:{
								checkchange:function(cc,ix,isChecked){
									var a={},
										obj=Ext.getCmp('TENANT.input.akses').getDataIndex(ix);
									a['i']=Ext.getCmp('TENANT.inputMenu.id').getValue();
									a['f1']=Ext.encode([]);
									a['f2']=Ext.encode([obj.i]);
									a['f3']=Ext.encode([]);
									a['f4']=Ext.encode([isChecked]);
									Ext.Ajax.request({
										url : url + 'cmd?m=TENANT&f=saveMenu',
										method : 'POST',
										params:a,
										success : function(response) {
											var r =ajaxSuccess(response);
										},
										failure : function(jqXHR, exception) {
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							}
						},{ text: 'Sub Akses',flex:1,dataIndex: 'f2' },
					]
				},{
					xtype:'isetting',
					id : 'TENANT.input.setting',
					level:1,
					flex:2,
					minWidth: 350,
					tbar:[
						'->',{
							xtype:'ihiddenfield',
							id:'TENANT.input.menuId',
						},{
							xtype:'itextfield',
							width: 350,
							readOnly:true,
							emptyText:'Tidak ada',
							fieldLabel:'Menu',
							margin:false,
							id:'TENANT.input.textMenu',
						}
					]
				}
			]
		},{xtype:'iconfirm',id : 'TENANT.confirm'}
	]
});