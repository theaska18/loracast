/*
	import EMPLOYEE.iemployee
	import cmp.ipanel
	import cmp.isetting
	import cmp.iselect
	import cmp.icomboquery
	import cmp.iinput
	import cmp.idatefield
	import cmp.itable
	import cmp.icombobox
	access USER_DELETE [List] Hapus
	access USER_UPDATE [List] Edit
	access USER_ACCESS [List] Menu Akses
	access USER_PASSWORD [List] Edit Password
	access USER_setting [Menu] Setting
	access USER.btnSearch [List] Tombol Cari
	access USER.search.f7 [Search] Pencarian Detail Penyewa
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('USER.list').refresh();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('USER.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('USER.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'USER.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'USER.search',
			modal:false,
			title:'Pengguna -  Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('USER.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('USER.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('USER.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('USER.search.f1').focus();
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
					id:'USER.search.btnSearch',
					handler: function() {
						Ext.getCmp('USER.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					handler: function() {
						Ext.getCmp('USER.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					id:'USER.search.btnClose',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('USER.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'USER.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							press:{
								enter:function(){
									_click('USER.search.btnSearch');
								}
							},
							fieldLabel:'Kode Pengguna',
							id:'USER.search.f1'
						},{
							xtype:'icomboquery',
							name:'f7',
							fieldLabel:'Penyewa',
							query:'SELECT tenant_id AS id, tenant_name as text FROM app_tenant ORDER BY tenant_name ASC',
							press:{
								enter:function(){
									_click('USER.search.btnSearch');
								}
							},
							id:'USER.search.f7'
						},{
							xtype:'itextfield',
							name:'f2',
							press:{
								enter:function(){
									_click('USER.search.btnSearch');
								}
							},
							fieldLabel:'Nomor ID',
						},{
							xtype:'itextfield',
							name:'f3',
							fieldLabel:'Nama',
							press:{
								enter:function(){
									_click('USER.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f4',
							fieldLabel:'Peran',
							press:{
								enter:function(){
									_click('USER.search.btnSearch');
								}
							}
						},{
							xtype:'iinput',
							label : 'Tgl Lahir',
							items : [
								{
									xtype:'idatefield',
									name : 'f5',
									margin:false,
									press:{
										enter:function(){
											_click('USER.search.btnSearch');
										}
									},
									emptyText: 'Dari'
								},{
									xtype:'displayfield',
									value:' &nbsp; - &nbsp; '
								},{
									xtype:'idatefield',
									name : 'f6',
									margin:false,
									press:{
										enter:function(){
											_click('USER.search.btnSearch');
										}
									},
									emptyText: 'Sampai'
								}
							]
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'USER.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('USER.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('USER.dropdown').getValue()]=Ext.getCmp('USER.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=USER&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('USER_DELETE',function(){
						Ext.getCmp('USER.confirm').confirm({
							msg : "Are you sure Delete data User Code '"+a.f1+"' ?",
							allow : 'USER.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url +'cmd?m=USER&f=delete', 
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('USER.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('USER.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('USER.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('USER.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('USER_UPDATE',function(){
						Ext.Ajax.request({
							url : url +'cmd?m=USER&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('USER.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('USER.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('USER.input.panel').qReset();
									Ext.getCmp('USER.input.f4').setValue({role_id:r.d.o.f4,role_name:r.d.o.f7});
									Ext.getCmp('USER.input.f1').setReadOnly(false);
									Ext.getCmp('USER.input.f1').setValue(o.f1);
									Ext.getCmp('USER.input.f6').setValue(o.f6);
									Ext.getCmp('USER.input.f4').setReadOnly(false);
									Ext.getCmp('USER.input.f2').setReadOnly(true);
									Ext.getCmp('USER.input.f3').setReadOnly(true);
									Ext.getCmp('USER.input.karyawan').setReadOnly(true);
									Ext.getCmp('USER.input.i').setValue(a.i);
									Ext.getCmp('USER.input.p').setValue('UPDATE');
									Ext.getCmp('USER.input').closing = false;
									Ext.getCmp('USER.list').hide();
									Ext.getCmp('USER.input').show();
									Ext.getCmp('USER.input.f1').focus();
									Ext.getCmp('USER.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('USER.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('USER.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('USER.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Pengguna</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'->',
				{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					iconCls: 'fa fa-plus fa-green',
					id:'USER.btnAdd',
					handler:function(a){
						Ext.getCmp('USER.input.panel').qReset();
						Ext.getCmp('USER.input.f1').setReadOnly(false);
						Ext.getCmp('USER.input.f2').setReadOnly(false);
						Ext.getCmp('USER.input.f3').setReadOnly(false);
						Ext.getCmp('USER.input.f4').setReadOnly(false);
						Ext.getCmp('USER.input.f6').setReadOnly(false);
						Ext.getCmp('USER.input.karyawan').setReadOnly(false);
						Ext.getCmp('USER.input.p').setValue('ADD');
						Ext.getCmp('USER.input.f6').setValue(_tenant_id.toString());
						Ext.getCmp('USER.input').closing = false;
						Ext.getCmp('USER.list').hide();
						Ext.getCmp('USER.input').show();
						Ext.getCmp('USER.input.f1').focus();
						Ext.getCmp('USER.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'USER.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'USER.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f1',
							data:[
								{id:'f1',text:'Kode User'},
								{id:'f3',text:'Nama'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('USER.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'USER.text',
							press:{
								enter:function(){
									_click('USER.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							id:'USER.btnSearch',
							handler : function(a) {
								Ext.getCmp('USER.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'USER.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						if(Ext.getCmp('USER.search.f7').getValue()==null || Ext.getCmp('USER.search.f7').getValue()==''){
							Ext.getCmp('USER.search.f7').setValue(_tenant_id.toString());
						}
						Ext.getCmp('USER.search').show();
						Ext.getCmp('USER.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ hidden:true,dataIndex: 'f6' },
				{ hidden:true,dataIndex: 'f7' },
				{ text: 'Kode Pengguna',width: 100, dataIndex: 'f1' },
				{ text: 'Nomor ID',width: 100, dataIndex: 'f2' },
				{ text: 'Nama',width:200,dataIndex: 'f3'},
				{ text: 'Peran',width: 150,align:'center',dataIndex: 'f4'},
				{ text: 'Tanggal Lahir',width: 100, xtype:'date',align:'center',dataIndex: 'f5' },{
					text: 'Akses',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-key',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						_access('USER_ACCESS',function(){
							Ext.getCmp('USER.inputMenu.id').setValue(record.raw.i);
							Ext.getCmp('USER.inputMenu.UserCode').setValue(record.raw.f1);
							Ext.getCmp('USER.inputMenu.f1').setValue(null);
							Ext.getCmp('USER.inputMenu.tenant').setValue(record.raw.f7);
							Ext.getCmp('USER.inputMenu.role').setValue(record.raw.f6);
							Ext.getCmp('USER.input.setting').tenant_id=record.raw.f7;
							Ext.getCmp('USER.input.setting').role_id=record.raw.f6;
							Ext.getCmp('USER.input.setting').user_id=record.raw.i;
							Ext.getCmp('USER.inputMenu.f1').setQuery('SELECT group_id as id,group_name AS text FROM app_menu_group WHERE active_flag=1 AND group_id in(select distinct(M.group_id) from app_menu M '+
						' INNER JOIN app_tenant_menu atm ON atm.menu_id=M.menu_id INNER JOIN app_role_menu arm ON arm.menu_id=M.menu_id WHERE atm.tenant_id='+record.raw.f7+' AND arm.role_id='+record.raw.f6+' ) ORDER by group_name');
							Ext.Ajax.request({
								url : url + 'cmd?m=USER&f=getForMenu',
								method : 'GET',
								params : {
									i : record.raw.i,
									t : record.raw.f7,
									r : record.raw.f6,
									group:''
								},
								before:function(){
									Ext.getCmp('USER.list').setLoading(true);
								},
								success : function(response) {
									Ext.getCmp('USER.list').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										var treeNode = Ext.getCmp('USER.input.tree').getRootNode();
										treeNode.removeAll();
										treeNode.appendChild(r.d);
										treeNode.expandChildren(true);
										Ext.getCmp('USER.list').hide();
										Ext.getCmp('USER.inputMenu').show();
										Ext.getCmp('USER.input.menuId').setValue('');
										Ext.getCmp('USER.input.textMenu').setValue('');
										Ext.getCmp('USER.input.setting').menu_code='';
										Ext.getCmp('USER.input.setting').refresh();
										Ext.getCmp('USER.input.akses').refresh();
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('USER.list').setLoading(false);
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
						Ext.getCmp('USER.list').fn.update(record.data);
					}
				},{
					text: 'Sandi',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						_access('USER_PASSWORD',function(){
							Ext.Ajax.request({
								url : url +'cmd?m=USER&f=initUpdate',
								params:{i:record.data.i},
								method : 'GET',
								before:function(){
									Ext.getCmp('USER.list').setLoading(true);
								},
								success : function(response) {
									Ext.getCmp('USER.list').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										var o=r.d.o;
										Ext.getCmp('USER.input.panel').qReset();
										Ext.getCmp('USER.input.f4').setValue({role_id:r.d.o.f4,role_name:r.d.o.f7});
										Ext.getCmp('USER.input.f1').setReadOnly(true);
										Ext.getCmp('USER.input.f1').setValue(o.f1);
										Ext.getCmp('USER.input.f4').setReadOnly(true);
										Ext.getCmp('USER.input.f2').setReadOnly(false);
										Ext.getCmp('USER.input.f3').setReadOnly(false);
										Ext.getCmp('USER.input.f6').setValue(o.f6);
										Ext.getCmp('USER.input.f6').setReadOnly(true);
										Ext.getCmp('USER.input.karyawan').setReadOnly(true);
										Ext.getCmp('USER.input.i').setValue(record.data.i);
										Ext.getCmp('USER.input.p').setValue('CHANGE');
										Ext.getCmp('USER.input').closing = false;
										Ext.getCmp('USER.list').hide();
										Ext.getCmp('USER.input').show();
										Ext.getCmp('USER.input.f2').focus();
										Ext.getCmp('USER.input.panel').qSetForm()
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('USER.list').setLoading(false);
									ajaxError(jqXHR, exception,true);
								}
							});
						});
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('USER.list').fn.delete(record.data);
					}
				}
			]
		},{
			id:'USER.input',
			border:false,
			hidden:true,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('USER.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('USER.input.btnClose');
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
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('USER.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('USER.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'USER.close',
								onY : function() {
									Ext.getCmp('USER.input').hide();
									Ext.getCmp('USER.list').show();
								}
							});
						}else{
							Ext.getCmp('USER.input').hide();
							Ext.getCmp('USER.list').show();
						}
					}
				},'->','<b>Input Pengguna</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'USER.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('USER.input.panel').qGetForm(true);
						if(req == false){
							var err=false;
							var mes='';
							if(Ext.getCmp('USER.input.p').getValue()=='ADD' || Ext.getCmp('USER.input.p').getValue()=='CHANGE')
								if(Ext.getCmp('USER.input.f2').getValue() !=Ext.getCmp('USER.input.f3').getValue()){
									err=true;
									Ext.getCmp('USER.input.f2').setValue('');
									Ext.getCmp('USER.input.f3').setValue('');
									Ext.getCmp('USER.input.f2').focus();
									mes='Password Tidak Sama.';
								}
							if(err==false)
								Ext.getCmp('USER.confirm').confirm({
									msg : 'Are you sure Save this Data ?',
									allow : 'USER.save',
									onY : function() {
										var param = Ext.getCmp('USER.input.panel').qParams();
										Ext.Ajax.request({
											url : url +'cmd?m=USER&f=save', 
											method : 'POST',
											params:param,
											before:function(){
												Ext.getCmp('USER.input').setLoading(true);
											},
											success : function(response) {
												Ext.getCmp('USER.input').setLoading(false);
												var r = ajaxSuccess(response);
												if (r.r == 'S') {
													Ext.getCmp('USER.input').hide();
													Ext.getCmp('USER.list').show();
													Ext.getCmp('USER.list').refresh();
												}
											},
											failure : function(jqXHR, exception) {
												Ext.getCmp('USER.input').setLoading(false);
												ajaxError(jqXHR, exception,true);
											}
										});
									}
								});
							else
								Ext.create('IToast').toast({msg : mes,type : 'warning'});
						}else{
							if(Ext.getCmp('USER.input.p').getValue()=='ADD'){
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
					id : 'USER.input.panel',
					submit:'USER.input.btnSave',
					width: 350,
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'USER.input.p'
						},{
							xtype:'ihiddenfield',
							name:'i',
							id:'USER.input.i'
						},{
							xtype:'itextfield',
							maxLength:32,
							name:'f1',
							id:'USER.input.f1',
							fieldLabel:'Kode Pengguna',
							submit:'USER.input.panel',
							note:'Kode ini digunakan saat Login',
							property:{
								lower:true,
								space:false
							},
							allowBlank: false
						},{
							xtype:'itextfield',
							maxLength:32,
							name:'f2',
							submit:'USER.input.panel',
							id:'USER.input.f2',
							note:'Password ini digunakan saat Login',
							inputType: 'password',
							fieldLabel:'Sandi',
							allowBlank: false
						},{
							xtype:'itextfield',
							maxLength:32,
							name:'f3',
							submit:'USER.input.panel',
							id:'USER.input.f3',
							inputType: 'password' ,
							fieldLabel:'Ulangi Sandi',
							allowBlank: false
						},{
							xtype:'icomboquery',
							fieldLabel:'Penyewa',
							name:'f6',
							submit:'USER.input.panel',
							id:'USER.input.f6',
							query:'SELECT tenant_id AS id, tenant_name as text FROM app_tenant ORDER BY tenant_name ASC',
							allowBlank: false,
							listeners:{
								select:function(a){
									Ext.getCmp('USER.input.f4').setValue(null);
									Ext.getCmp('USER.input.karyawan').setValue(null);
								}
							}
						},{
							xtype:'iselect',
							fieldLabel:'Peran',
							id:'USER.input.f4',
							allowBlank : false,
							note:'diambil dari menu peran.',
							valueField:'role_id',
							textField:'role_name',
							name:'f4',
							submit:'USER.input.panel',
							onBeforeShow:function(){
								Ext.getCmp('USER.input.role.f2').setValue(Ext.getCmp('USER.input.f6').getValue());
							},
							button:{
								items:[
									{
										xtype:'itextfield',
										name:'f1',
										database:{
											table:'app_role',
											field:'M.role_code',
											separator:'like'
										},
										fieldLabel:'Kode Peran',
										press:{
											enter:function(){
												Ext.getCmp('USER.input.f4').refresh();
											}
										}
									},{
										xtype:'ihiddenfield',
										name:'f4',
										database:{
											table:'app_role',
											field:'M.tenant_id',
											type:'double',
											separator:'='
										},
										id:'USER.input.role.f2',
										value:_tenant_id
									},{
										xtype:'itextfield',
										name:'f2',
										database:{
											table:'app_role',
											field:'M.role_name',
											separator:'like'
										},
										press:{
											enter:function(){
												Ext.getCmp('USER.input.f4').refresh();
											}
										},
										fieldLabel:'Nama Peran'
									},{
										xtype:'itextfield',
										name:'f3',
										database:{
											table:'app_role',
											field:'M.description',
											separator:'like'
										},
										press:{
											enter:function(){
												Ext.getCmp('USER.input.f4').refresh();
											}
										},
										fieldLabel:'Deskripsi'
									},{
										xtype:'ihiddenfield',
										name:'f5',
										database:{
											table:'app_role',
											field:'M.active_flag',
											type:'active',
										},
										value:'Y'
									}
								],
								database:{
									table:'app_role'
								},
								columns:[
									{ hidden:true,dataIndex: 'role_id',database:{field:'role_id'} },
									{ text: 'Peran',width: 80, dataIndex: 'role_code' ,align:'center',database:{field:'role_code'} },
									{ text: 'Nama',width: 200,dataIndex: 'role_name',database:{field:"role_name"} },
									{ text: 'Deskripsi',flex:1, dataIndex:'description' ,database:{field:'description'} },
								]
							}
						},{
							xtype:'iemployee',
							id:'USER.input.karyawan',
							note:'Karyawan yang akan diberi Akses Pengguna.',
							name:'f5',
							submit:'USER.input.panel',
							onBeforeShow:function(){
								Ext.getCmp('USER.input.karyawan.f2').setValue(Ext.getCmp('USER.input.f6').getValue());
								Ext.getCmp('USER.input.karyawan.f4').setValue('(SELECT i.employee_id FROM app_user i)');
							},
						}
					]
				}
			]
		},{
			id:'USER.inputMenu',
			hidden:true,
			border:false,
			listeners:{
				show:function(){
					shortcut.set({
						code:'inputMenu',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('USER.inputMenu.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('USER.inputMenu.btnClose');
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
					iconCls:'fa fa-chevron-left fa-red',
					id:'USER.inputMenu.btnClose',
					handler: function() {
						Ext.getCmp('USER.inputMenu').hide();
						Ext.getCmp('USER.list').show();
					}
				},'->','<b>Akses Pengguna</b>','->'
			],
			autoScroll :true,
			layout:{
				type:'hbox',
				align:'stretch'
			},
			items:[
				{
					xtype:'ihiddenfield',
					id:'USER.inputMenu.UserCode'
				},{
					xtype:'ihiddenfield',
					id:'USER.inputMenu.id'
				},{
					xtype:'ihiddenfield',
					id:'USER.inputMenu.tenant'
				},{
					xtype:'ihiddenfield',
					id:'USER.inputMenu.role'
				},{
					xtype:'treepanel',
					border:false,
					autoScroll :true,
					root : {
						expanded : true
					},
					width: 250,
					id : 'USER.input.tree',
					store: Ext.create('Ext.data.TreeStore', {
						root: {
							expanded: true,
							children: []
						}
					}),
					tbar:{
						xtype:'icomboquery',
						id : 'USER.inputMenu.f1',
						query:'SELECT group_id as id,group_name AS text FROM app_menu_group WHERE active_flag=1 AND group_id in(select distinct(M.group_id) from app_menu M '+
							' INNER JOIN app_tenant_menu atm ON atm.menu_id=M.menu_id WHERE tenant_id='+_tenant_id+') ORDER by group_name',
						name : 'f1',
						emptyText: 'Grup Menu',
						width: 250,
						listeners:{
							change:function(){
								Ext.Ajax.request({
									url : url + 'cmd?m=USER&f=getForMenu',
									method : 'GET',
									params : {
										i : Ext.getCmp('USER.inputMenu.id').getValue(),
										t : Ext.getCmp('USER.inputMenu.tenant').getValue(),
										r : Ext.getCmp('USER.inputMenu.role').getValue(),
										group:Ext.getCmp('USER.inputMenu.f1').getValue()
									},
									before:function(){
										Ext.getCmp('USER.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('USER.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S') {
											var treeNode = Ext.getCmp('USER.input.tree').getRootNode();
											treeNode.removeAll();
											treeNode.appendChild(r.d);
											treeNode.expandChildren(true);
											Ext.getCmp('USER.inputMenu').show();
											Ext.getCmp('USER.input.menuId').setValue('');
											Ext.getCmp('USER.input.textMenu').setValue('');
											Ext.getCmp('USER.input.setting').menu_code='';
											Ext.getCmp('USER.input.setting').refresh();
											Ext.getCmp('USER.input.akses').refresh();
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('USER.list').setLoading(false);
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
							if(_access('USER_setting')==false && r.raw.type=='MENU'){
								Ext.getCmp('USER.input.menuId').setValue(r.raw.f1);
								Ext.getCmp('USER.input.textMenu').setValue(r.raw.text);
								Ext.getCmp('USER.input.setting').menu_code=r.raw.f2;
								Ext.getCmp('USER.input.setting').refresh();
								Ext.getCmp('USER.input.akses').refresh();
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
							a['i']=Ext.getCmp('USER.inputMenu.id').getValue();
							a['f1']=Ext.encode(arrA);
							a['f2']=Ext.encode(arrB);
							a['f3']=Ext.encode(arrAc);
							a['f4']=Ext.encode(arrBc);
							Ext.Ajax.request({
								url : url + 'cmd?m=USER&f=saveMenu',
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
					id : 'USER.input.akses',
					params:function(bo){
						var arr={};
						arr['tenant_id']=Ext.getCmp('USER.inputMenu.tenant').getValue();
						arr['menu_id']=Ext.getCmp('USER.input.menuId').getValue();
						arr['role_id']=Ext.getCmp('USER.inputMenu.role').getValue();
						arr['user_id']=Ext.getCmp('USER.inputMenu.id').getValue();
						return arr;
					},
					url:url + 'cmd?m=USER&f=getListAccess',
					result:function(response){
						return {list:response.d,total:response.t};
					},
					columns:[
						{ hidden:true,dataIndex: 'i' },
						{ xtype: 'checkcolumn',
							header: '&nbsp;',
							dataIndex: 'f1',
							width:30,
							editor: {
								xtype: 'checkbox',
								cls: 'x-grid-checkheader-editor'
							},listeners:{
								checkchange:function(cc,ix,isChecked){
									var a={},
										obj=Ext.getCmp('USER.input.akses').getDataIndex(ix);
									a['i']=Ext.getCmp('USER.inputMenu.id').getValue();
									a['f1']=Ext.encode([]);
									a['f2']=Ext.encode([obj.i]);
									a['f3']=Ext.encode([]);
									a['f4']=Ext.encode([isChecked]);
									Ext.Ajax.request({
										url : url + 'cmd?m=USER&f=saveMenu',
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
					id : 'USER.input.setting',
					level:3,
					flex:2,
					minWidth: 600,
					tbar:[
						{
							xtype:'ihiddenfield',
							id:'USER.input.menuId',
						},{
							xtype:'itextfield',
							width: 300,
							readOnly:true,
							emptyText:'Tidak ada',
							fieldLabel:'Menu',
							margin:false,
							id:'USER.input.textMenu',
						}
					]
				}
			]
		},{xtype:'iconfirm',id : 'USER.confirm'}
	]
});