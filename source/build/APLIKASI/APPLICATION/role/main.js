/*
	import cmp.iconfig
	import cmp.ipanel
	import cmp.icomboquery
	import cmp.isetting
	import cmp.icombobox
	import cmp.itable
	import PARAMETER.iparameter
	access ROLE.config [List] Setting 
	access ROLE.btnSearch [List] Cari 
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('ROLE.list').refresh();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('ROLE.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('ROLE.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'ROLE.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'ROLE.search',
			modal:false,
			title:'Peran -  Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('ROLE.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('ROLE.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('ROLE.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('ROLE.search.f1').focus();
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
					id:'ROLE.search.btnSearch',
					iconCls:'fa fa-search fa-green',
					handler: function() {
						Ext.getCmp('ROLE.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'ROLE.search.btnReset',
					handler: function() {
						Ext.getCmp('ROLE.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					id:'ROLE.search.btnClose',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('ROLE.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'ROLE.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Peran',
							press:{
								enter:function(){
									_click('ROLE.search.btnSearch');
								}
							},
							id:'ROLE.search.f1'
						},{
							xtype:'icomboquery',
							name:'f5',
							fieldLabel:'Penyewa',
							query:'SELECT tenant_id AS id, tenant_name as text FROM app_tenant ORDER BY tenant_name ASC',
							press:{
								enter:function(){
									_click('ROLE.search.btnSearch');
								}
							},
							id:'ROLE.search.f5'
						},{
							xtype:'itextfield',
							name:'f2',
							press:{
								enter:function(){
									_click('ROLE.search.btnSearch');
								}
							},
							fieldLabel:'Nama Peran',
						},{
							xtype:'itextfield',
							name:'f3',
							press:{
								enter:function(){
									_click('ROLE.search.btnSearch');
								}
							},
							fieldLabel:'Deskripsi',
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f4',
							press:{
								enter:function(){
									_click('ROLE.search.btnSearch');
								}
							},
							fieldLabel: 'Aktif',
							width: 200
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'ROLE.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('ROLE.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('ROLE.dropdown').getValue()]=Ext.getCmp('ROLE.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=ROLE&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			press:{
				delete:function(a){
					Ext.getCmp('ROLE.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('ROLE.list').fn.update(a.dataRow);
				}
			},
			fn:{
				update:function(a){
					_access('ROLE_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=ROLE&f=initUpdate',
							method : 'GET',
							params:{i:a.i},
							before:function(){
								Ext.getCmp('ROLE.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('ROLE.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d;
									Ext.getCmp('ROLE.input.panel').qReset();
									Ext.getCmp('ROLE.input.f1').setReadOnly(true);
									Ext.getCmp('ROLE.input.f5').setReadOnly(true);
									Ext.getCmp('ROLE.input.p').setValue('UPDATE');
									Ext.getCmp('ROLE.input.i').setValue(a.i);
									Ext.getCmp('ROLE.input.f1').setValue(o.f1);
									Ext.getCmp('ROLE.input.f2').setValue(o.f2);
									Ext.getCmp('ROLE.input.f3').setValue(o.f3);
									Ext.getCmp('ROLE.input.f4').setValue(o.f4);
									Ext.getCmp('ROLE.input.f5').setValue(o.f5);
									Ext.getCmp('ROLE.list').hide();
									Ext.getCmp('ROLE.input').show();
									// Ext.getCmp('ROLE.input').setTitle('Peran - Edit');
									Ext.getCmp('ROLE.input').closing = false;
									Ext.getCmp('ROLE.input.f2').focus();
									Ext.getCmp('ROLE.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('ROLE.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				},
				delete:function(a){
					_access('ROLE_DELETE',function(){
						Ext.getCmp('ROLE.confirm').confirm({
							msg : "Apakah Ingin Menghapus Kode Peran '"+a.f1+"' ?",
							allow : 'ROLE.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=ROLE&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('ROLE.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('ROLE.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('ROLE.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('ROLE.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				}
			},
			tbar:[iif(_mobile,'<b>Peran</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
					xtype:'iconfig',
					id:'ROLE.config',
					menuCode:'ROLE',
					code:[
						iif(_access('ROLE_config_SEQUENCE')==false,'SEQUENCE',null),
						iif(_access('ROLE_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
					]
				},'->',{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'ROLE.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('ROLE.input.f5').setReadOnly(false);
						Ext.getCmp('ROLE.input.panel').qReset();
						Ext.getCmp('ROLE.input.p').setValue('ADD');
						Ext.getCmp('ROLE.input.f5').setValue(_tenant_id.toString());
						Ext.getCmp('ROLE.input').closing = false;
						Ext.getCmp('ROLE.list').hide();
						Ext.getCmp('ROLE.input').show();
						// Ext.getCmp('ROLE.input').setTitle('Peran - Tambah');
						if(getSetting('ROLE','SEQUENCE')=='Y'){
							Ext.getCmp('ROLE.input.f1').setReadOnly(true);
							Ext.getCmp('ROLE.input.f2').focus();
						}else{
							Ext.getCmp('ROLE.input.f1').setReadOnly(false);
							Ext.getCmp('ROLE.input.f1').focus();
						}
						Ext.getCmp('ROLE.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'ROLE.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'ROLE.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Nama Peran'},
								{id:'f1',text:'Kode Peran'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('ROLE.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'ROLE.text',
							press:{
								enter:function(){
									_click('ROLE.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							id:'ROLE.btnSearch',
							handler : function(a) {
								Ext.getCmp('ROLE.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'ROLE.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						if(Ext.getCmp('ROLE.search.f5').getValue()==null || Ext.getCmp('ROLE.search.f5').getValue()==''){
							Ext.getCmp('ROLE.search.f5').setValue(_tenant_id.toString());
						}
						Ext.getCmp('ROLE.search').show();
						Ext.getCmp('ROLE.search.f1').focus();
					}
				}
			],
			columns:[
				{xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ hidden:true,dataIndex: 'f5' },
				{ text: 'Kode Peran',width: 100, dataIndex: 'f1'},
				{ text: 'Nama Peran',width: 150, dataIndex: 'f2'},
				{ text: 'Deskripsi',width: 500,dataIndex: 'f3'},
				{ xtype: 'active',dataIndex: 'f4'},
				{
					text: 'Akses',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-key',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						_access('ROLE_ACCESS',function(){
							Ext.getCmp('ROLE.inputMenu.id').setValue(record.raw.i);
							Ext.getCmp('ROLE.inputMenu.f1').setValue(null);
							Ext.getCmp('ROLE.input.setting').tenant_id=record.raw.f5;
							Ext.getCmp('ROLE.input.setting').role_id=record.raw.i;
							Ext.getCmp('ROLE.inputMenu.f1').setQuery('SELECT group_id as id,group_name AS text FROM app_menu_group WHERE active_flag=1 AND group_id in(select distinct(m.group_id) from app_menu m '+
								' INNER JOIN app_tenant_menu atm ON atm.menu_id=m.menu_id WHERE tenant_id='+record.raw.f5+') ORDER by group_name');
							Ext.getCmp('ROLE.inputMenu.roleCode').setValue(record.raw.f1);
							Ext.getCmp('ROLE.inputMenu.tenant').setValue(record.raw.f5);
							Ext.Ajax.request({
								url : url + 'cmd?m=ROLE&f=getForMenu',
								method : 'GET',
								params : {
									i : record.raw.i,
									t : record.raw.f5,
									group:''
								},
								before:function(){
									Ext.getCmp('ROLE.list').setLoading(true);
								},
								success : function(response) {
									Ext.getCmp('ROLE.list').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										var treeNode = Ext.getCmp('ROLE.input.tree').getRootNode();

										treeNode.removeAll();
										if(r.d.length>0){
											treeNode.appendChild(r.d);
										}
										treeNode.expandChildren(true);
										Ext.getCmp('ROLE.list').hide();
										Ext.getCmp('ROLE.inputMenu').show();
										Ext.getCmp('ROLE.input.menuId').setValue('');
										Ext.getCmp('ROLE.input.textMenu').setValue('');
										Ext.getCmp('ROLE.input.setting').menu_code='';
										Ext.getCmp('ROLE.input.setting').refresh();
										Ext.getCmp('ROLE.input.akses').refresh();
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('ROLE.list').setLoading(false);
									ajaxError(jqXHR, exception,true);
								}
							});
						})
					}
				},{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('ROLE.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('ROLE.list').fn.delete(record.data);
					}
				}
			]
		},{
			// title:'Peran',
			id:'ROLE.input',
			border : false,
			hidden:true,
			listeners:{
				show:function(){
					// hideTab();
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('ROLE.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('ROLE.input.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					// showTab();
					shortcut.remove('input');
				}
			},
			tbar: [
				{
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					iconCls:'fa fa-chevron-left fa-red',
					id:'ROLE.input.btnClose',
					handler: function() {
						var req=Ext.getCmp('ROLE.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('ROLE.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'ROLE.close',
								onY : function() {
									Ext.getCmp('ROLE.input').hide();
									Ext.getCmp('ROLE.list').show();
								}
							});
						}else{
							Ext.getCmp('ROLE.input').hide();
							Ext.getCmp('ROLE.list').show();
						}
					}
				},'->','<b>Input Peran</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'ROLE.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('ROLE.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('ROLE.confirm').confirm({
								msg : 'Apakah Ingin Menyimpan Data Ini ?',
								allow : 'ROLE.save',
								onY : function() {
									var param = Ext.getCmp('ROLE.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=ROLE&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('ROLE.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('ROLE.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('ROLE.input').hide();
												Ext.getCmp('ROLE.list').show();
												Ext.getCmp('ROLE.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('ROLE.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else{
							if(Ext.getCmp('ROLE.input.p').getValue()=='ADD'){
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
					id : 'ROLE.input.panel',
					submit:'ROLE.input.btnSave',
					width: 350,
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'ROLE.input.p'
						},{
							xtype:'ihiddenfield',
							name:'i',
							id:'ROLE.input.i'
						},{
							xtype:'itextfield',
							maxLength:16,
							name:'f1',
							fieldLabel: 'Kode Peran',
							submit:'ROLE.input.panel',
							property:{
								upper:true,
								space:false
							},
							id:'ROLE.input.f1',
							allowBlank: false
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Peran',
							submit:'ROLE.input.panel',
							property:{
								dynamic:true
							},
							id:'ROLE.input.f2',
							allowBlank: false
						},{
							xtype:'icomboquery',
							fieldLabel:'Penyewa',
							submit:'ROLE.input.panel',
							name:'f5',
							id:'ROLE.input.f5',
							query:'SELECT tenant_id AS id, tenant_name as text FROM app_tenant ORDER BY tenant_name ASC',
							allowBlank: false,
						},{
							xtype:'itextarea',
							name:'f3',
							submit:'ROLE.input.panel',
							fieldLabel:'Deskripsi',
							id:'ROLE.input.f3'
						},{
							xtype:'icheckbox',
							name:'f4',
							submit:'ROLE.input.panel',
							fieldLabel:'Aktif',
							checked:true,
							id:'ROLE.input.f4'
						}
					]
				}
			]
		},{
			id:'ROLE.inputMenu',
			// title:'Peran - Menu',
			border:false,
			hidden:true,
			layout:'fit',
			listeners:{
				show:function(){
					// hideTab();
					shortcut.set({
						code:'inputMenu',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('ROLE.inputMenu.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('ROLE.inputMenu.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					// showTab();
					shortcut.remove('inputMenu');
				}
			},
			autoScroll :true,
			tbar:[
				{
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					iconCls:'fa fa-chevron-left fa-red',
					id:'ROLE.inputMenu.btnClose',
					handler: function() {
						Ext.getCmp('ROLE.inputMenu').hide();
						Ext.getCmp('ROLE.list').show();
					}
				},'->','<b>Akses Peran</b>','->',
			],
			layout:{
				type:'hbox',
				align:'stretch'
			},
			items:[
				{
					xtype:'ihiddenfield',
					id:'ROLE.inputMenu.roleCode'
				},{
					xtype:'ihiddenfield',
					id:'ROLE.inputMenu.id'
				},{
					xtype:'ihiddenfield',
					id:'ROLE.inputMenu.tenant'
				},{
					xtype:'treepanel',
					border:false,
					autoScroll :true,
					root : {
						expanded : true
					},
					width: 250,
					id : 'ROLE.input.tree',
					store: Ext.create('Ext.data.TreeStore', {
						root: {
							expanded: true,
							children: []
						}
					}),
					tbar:{
						xtype:'icomboquery',
						id : 'ROLE.inputMenu.f1',
						query:'SELECT group_id as id,group_name AS text FROM app_menu_group WHERE active_flag=1 AND group_id in(select distinct(m.group_id) from app_menu m '+
							' INNER JOIN app_tenant_menu atm ON atm.menu_id=m.menu_id WHERE tenant_id='+_tenant_id+') ORDER by group_name',
						name : 'f1',
						emptyText: 'Grup Menu',
						width: 250,
						listeners:{
							change:function(){
								Ext.Ajax.request({
									url : url + 'cmd?m=ROLE&f=getForMenu',
									method : 'GET',
									params : {
										i : Ext.getCmp('ROLE.inputMenu.id').getValue(),
										t : Ext.getCmp('ROLE.inputMenu.tenant').getValue(),
										group:Ext.getCmp('ROLE.inputMenu.f1').getValue()
									},
									before:function(){
										Ext.getCmp('ROLE.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('ROLE.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S') {
											var treeNode = Ext.getCmp('ROLE.input.tree').getRootNode();
											treeNode.removeAll();
											treeNode.appendChild(r.d);
											treeNode.expandChildren(true);
											// Ext.getCmp('ROLE.inputMenu').show();
											Ext.getCmp('ROLE.input.menuId').setValue('');
											Ext.getCmp('ROLE.input.textMenu').setValue('');
											Ext.getCmp('ROLE.input.setting').menu_code='';
											Ext.getCmp('ROLE.input.setting').refresh();
											Ext.getCmp('ROLE.input.akses').refresh();
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('ROLE.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						},
						margin:false,
					},
					rootVisible: false,
					listeners: {
						itemclick:function(a,r){
							if(_access('ROLE_setting')==false && r.raw.type=='MENU'){
								Ext.getCmp('ROLE.input.menuId').setValue(r.raw.f1);
								Ext.getCmp('ROLE.input.textMenu').setValue(r.raw.text);
								Ext.getCmp('ROLE.input.setting').menu_code=r.raw.f2;
								Ext.getCmp('ROLE.input.setting').refresh();
								Ext.getCmp('ROLE.input.akses').refresh();
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
							a['i']=Ext.getCmp('ROLE.inputMenu.id').getValue();
							a['f1']=Ext.encode(arrA);
							a['f2']=Ext.encode(arrB);
							a['f3']=Ext.encode(arrAc);
							a['f4']=Ext.encode(arrBc);
							Ext.Ajax.request({
								url : url + 'cmd?m=ROLE&f=saveMenu',
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
					minWidth: 250,
					hideHeaders: true,
					title:'Sub Akses',
					hideBbar:true,
					id : 'ROLE.input.akses',
					params:function(bo){
						var arr={};
						arr['tenant_id']=Ext.getCmp('ROLE.inputMenu.tenant').getValue();
						arr['menu_id']=Ext.getCmp('ROLE.input.menuId').getValue();
						arr['role_id']=Ext.getCmp('ROLE.inputMenu.id').getValue();
						return arr;
					},
					url:url + 'cmd?m=ROLE&f=getListAccess',
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
										obj=Ext.getCmp('ROLE.input.akses').getDataIndex(ix);
									a['i']=Ext.getCmp('ROLE.inputMenu.id').getValue();
									a['f1']=Ext.encode([]);
									a['f2']=Ext.encode([obj.i]);
									a['f3']=Ext.encode([]);
									a['f4']=Ext.encode([isChecked]);
									Ext.Ajax.request({
										url : url + 'cmd?m=ROLE&f=saveMenu',
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
					id : 'ROLE.input.setting',
					level:2,
					flex:2,
					minWidth: 550,
					tbar:[
						{
							xtype:'ihiddenfield',
							id:'ROLE.input.menuId',
						},{
							xtype:'itextfield',
							width: 300,
							readOnly:true,
							emptyText:'Tidak ada',
							fieldLabel:'Menu',
							margin:false,
							id:'ROLE.input.textMenu',
						}
					]
				}
			]
		},{xtype:'iconfirm',id : 'ROLE.confirm'}
	]
});