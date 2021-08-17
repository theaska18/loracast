/*
	import cmp.ipanel
	import cmp.itable
	import cmp.iconfig
	import cmp.ipanel
	import cmp.icombobox
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('JOB.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('JOB.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('JOB.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('JOB.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'JOB.main',
	border:false,
	layout:'fit',
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'JOB.search',
			modal:false,
			title:'Pekerjaan - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('JOB.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('JOB.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('JOB.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('JOB.search.f1').focus();
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
					id:'JOB.search.btnSearch',
					handler: function() {
						Ext.getCmp('JOB.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'JOB.search.btnReset',
					handler: function() {
						Ext.getCmp('JOB.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					id:'JOB.search.btnClose',
					handler: function() {
						Ext.getCmp('JOB.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'JOB.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Pekerjaan',
							press:{
								enter:function(){
									_click('JOB.search.btnSearch');
								}
							},
							id:'JOB.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Pekerjaan',
							press:{
								enter:function(){
									_click('JOB.search.btnSearch');
								}
							},
							id:'JOB.search.f2'
						},{
							xtype:'iparameter',
							id : 'JOB.search.f3',
							parameter:'ACTIVE_FLAG',
							name : 'f3',
							press:{
								enter:function(){
									_click('JOB.search.btnSearch');
								},
							},
							width: 200,
							fieldLabel: 'Aktif'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'JOB.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('JOB.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('JOB.dropdown').getValue()]=Ext.getCmp('JOB.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=JOB&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('JOB_DELETE',function(){
						Ext.getCmp('JOB.confirm').confirm({
							msg : "Apakah akan Menghapus Pekerjaan '"+a.f1+"' ?",
							allow : 'JOB.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=JOB&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('JOB.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('JOB.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S'){
											Ext.getCmp('JOB.list').refresh();
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('JOB.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('JOB_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=JOB&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('JOB.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('JOB.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('JOB.input.panel').qReset();
									Ext.getCmp('JOB.input.f1').setReadOnly(true);
									Ext.getCmp('JOB.input.i').setValue(a.i);
									Ext.getCmp('JOB.input.f1').setValue(o.f1);
									Ext.getCmp('JOB.input.f2').setValue(o.f2);
									Ext.getCmp('JOB.input.f3').setValue(o.f3);
									Ext.getCmp('JOB.input.p').setValue('UPDATE');
									Ext.getCmp('JOB.list').hide();
									Ext.getCmp('JOB.input').show();
									Ext.getCmp('JOB.input.f2').focus();
									Ext.getCmp('JOB.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('JOB.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('JOB.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('JOB.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Pekerjaan</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
				xtype:'iconfig',
				id:'JOB.config',
				menuCode:'JOB',
				code:[
					iif(_access('JOB_config_SEQUENCE')==false,'SEQUENCE',null),
					iif(_access('JOB_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
				]
			},'->',{
				text: 'Tambah',
				tooltip:'Tambah <b>[F6]</b>',
				id:'JOB.btnAdd',
				iconCls: 'fa fa-plus fa-green',
				handler:function(a){
					Ext.getCmp('JOB.input.panel').qReset();
					Ext.getCmp('JOB.input.p').setValue('ADD');
					Ext.getCmp('JOB.list').hide();
					Ext.getCmp('JOB.input').show();
					if(getSetting('JOB','SEQUENCE')=='Y'){
						Ext.getCmp('JOB.input.f1').setReadOnly(true);
						Ext.getCmp('JOB.input.f2').focus();
					}else{
						Ext.getCmp('JOB.input.f1').setReadOnly(false);
						Ext.getCmp('JOB.input.f1').focus();
					}
					Ext.getCmp('JOB.input.panel').qSetForm();
				}
			},{
				xtype:'buttongroup',
				id:'JOB.group.search',
				hidden:_mobile,
				items:[
					{
						xtype:'icombobox',
						id : 'JOB.dropdown',
						emptyText:'Pencarian',
						margin:false,
						value:'f2',
						data:[
							{id:'f2',text:'Nama Pekerjaan'},
							{id:'f1',text:'Kode Pekerjaan'},
						],
						width: 150,
						press:{
							enter:function(){
								_click('JOB.btnSearch');
							}
						}
					},{
						xtype:'itextfield',
						width: 200,
						emptyText:'Pencarian',
						margin:false,
						tooltip:'Pencarian [Ctrl+f]',
						id:'JOB.text',
						press:{
							enter:function(){
								_click('JOB.btnSearch');
							}
						}
					},{
						iconCls: 'fa fa-search',
						tooltip:'Pencarian',
						id:'JOB.btnSearch',
						handler : function(a) {
							Ext.getCmp('JOB.list').refresh(false);
						}
					}
				]
			},{
				tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
				id:'JOB.btnShowSearch',
				iconCls: 'fa fa-filter',
				handler:function(a){
					Ext.getCmp('JOB.search').show();
					Ext.getCmp('JOB.search.f1').focus();
				}
			}],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text: 'Kode Pekerjaan',width: 120, dataIndex: 'f1' },
				{ text: 'Nama Pekerjaan',flex:1,minWidth:200,dataIndex: 'f2'},
				{ xtype: 'active',dataIndex: 'f3'},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('JOB.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('JOB.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'JOB.input',
			hidden:true,
			border:false,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('JOB.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('JOB.input.btnClose');
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
					id:'JOB.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('JOB.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('JOB.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'JOB.close',
								onY : function() {
									Ext.getCmp('JOB.input').hide();
									Ext.getCmp('JOB.list').show();
								}
							});
						}else{
							Ext.getCmp('JOB.input').hide();
							Ext.getCmp('JOB.list').show();
						}
					}
				},'->','<b>Input Pekerjaan</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'JOB.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('JOB.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('JOB.confirm').confirm({
								msg : 'Apakah Akan Menyimpan Data Ini ?',
								allow : 'JOB.save',
								onY : function() {
									var param = Ext.getCmp('JOB.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=JOB&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('JOB.input').setLoading(true);
										},									
										success : function(response) {
											Ext.getCmp('JOB.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('JOB.input').hide();
												Ext.getCmp('JOB.list').show();
												Ext.getCmp('JOB.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('JOB.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else{
							if(Ext.getCmp('JOB.input.p').getValue()=='ADD'){
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
					id : 'JOB.input.panel',
					width: 350,
					submit:'JOB.input.btnSave',
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'JOB.input.p'
						},{
							xtype:'ihiddenfield',
							name:'i',
							id:'JOB.input.i'
						},{
							xtype:'itextfield',
							maxLength:32,
							submit:'JOB.input.panel',
							fieldLabel:'Kode Pekerjaan',
							name:'f1',
							property:{
								upper:true,
								space:false
							},
							id:'JOB.input.f1',
							allowBlank: false
						},{
							xtype:'itextfield',
							maxLength:64,
							submit:'JOB.input.panel',
							name:'f2',
							fieldLabel:'Nama Pekerjaan',
							property:{
								dynamic:true
							},
							id:'JOB.input.f2',
							allowBlank: false
						},{
							xtype:'icheckbox',
							submit:'JOB.input.panel',
							name:'f3',
							fieldLabel:'Aktif',
							id:'JOB.input.f3',
							checked:true
						}
					]
				}
			],
		},{xtype:'iconfirm',id : 'JOB.confirm'}
	]
});
