/*
	import cmp.ipanel
	import cmp.itable
	import cmp.icombobox
	import cmp.itextarea
	import cmp.iconfig
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('DISTRIBUTOR_TYPE.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('DISTRIBUTOR_TYPE.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('DISTRIBUTOR_TYPE.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('DISTRIBUTOR_TYPE.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'DISTRIBUTOR_TYPE.main',
	layout:'fit',
	border:false,
	paddingBottom:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'DISTRIBUTOR_TYPE.search',
			modal:false,
			title:'Jenis Vendor - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('DISTRIBUTOR_TYPE.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('DISTRIBUTOR_TYPE.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('DISTRIBUTOR_TYPE.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('DISTRIBUTOR_TYPE.search.f1').focus();
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
					text:'Cari',
					tooltip:'Cari <b>[Ctrl+s]</b>',
					iconCls:'fa fa-search fa-green',
					id:'DISTRIBUTOR_TYPE.search.btnSearch',
					handler: function() {
						Ext.getCmp('DISTRIBUTOR_TYPE.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'DISTRIBUTOR_TYPE.search.btnReset',
					handler: function() {
						Ext.getCmp('DISTRIBUTOR_TYPE.search.panel').qReset();
					}
				},{
					text:'Close',
					tooltip:'Close <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('DISTRIBUTOR_TYPE.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'DISTRIBUTOR_TYPE.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Jenis',
							press:{
								enter:function(){
									_click('DISTRIBUTOR_TYPE.search.btnSearch');
								}
							},
							id:'DISTRIBUTOR_TYPE.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Jenis',
							press:{
								enter:function(){
									_click('DISTRIBUTOR_TYPE.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f3',
							fieldLabel:'Deskripsi',
							press:{
								enter:function(){
									_click('DISTRIBUTOR_TYPE.search.btnSearch');
								}
							},
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f4',
							width: 200,
							press:{
								enter:function(){
									_click('DISTRIBUTOR_TYPE.search.btnSearch');
								},
							},
							fieldLabel:'Aktif'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'DISTRIBUTOR_TYPE.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('DISTRIBUTOR_TYPE.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('DISTRIBUTOR_TYPE.dropdown').getValue()]=Ext.getCmp('DISTRIBUTOR_TYPE.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=DISTRIBUTOR_TYPE&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('DISTRIBUTOR_TYPE_DELETE',function(){
						Ext.getCmp('DISTRIBUTOR_TYPE.confirm').confirm({
							msg : "Apakah akan hapus Kode Jenis '"+a.f1+"' ?",
							allow : 'DISTRIBUTOR_TYPE.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=DISTRIBUTOR_TYPE&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('DISTRIBUTOR_TYPE.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('DISTRIBUTOR_TYPE.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('DISTRIBUTOR_TYPE.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('DISTRIBUTOR_TYPE.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('DISTRIBUTOR_TYPE_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=DISTRIBUTOR_TYPE&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('DISTRIBUTOR_TYPE.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('DISTRIBUTOR_TYPE.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('DISTRIBUTOR_TYPE.input.panel').qReset();
									Ext.getCmp('DISTRIBUTOR_TYPE.input.f1').setReadOnly(true);
									Ext.getCmp('DISTRIBUTOR_TYPE.input.f1').setValue(a.f1);
									Ext.getCmp('DISTRIBUTOR_TYPE.input.f2').setValue(a.f2);
									Ext.getCmp('DISTRIBUTOR_TYPE.input.f3').setValue(o.f3);
									Ext.getCmp('DISTRIBUTOR_TYPE.input.f4').setValue(o.f4);
									Ext.getCmp('DISTRIBUTOR_TYPE.input.i').setValue(a.i);
									Ext.getCmp('DISTRIBUTOR_TYPE.input.p').setValue('UPDATE');
									Ext.getCmp('DISTRIBUTOR_TYPE.list').hide();
									Ext.getCmp('DISTRIBUTOR_TYPE.input').show();
									Ext.getCmp('DISTRIBUTOR_TYPE.input.f2').focus();
									Ext.getCmp('DISTRIBUTOR_TYPE.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('DISTRIBUTOR_TYPE.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
					
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('DISTRIBUTOR_TYPE.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('DISTRIBUTOR_TYPE.list').fn.update(a.dataRow);
				}
			},
				tbar:[iif(_mobile,'<b>Jenis Vendor</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
					xtype:'iconfig',
					id:'DISTRIBUTOR_TYPE.config',
					menuCode:'DISTRIBUTOR_TYPE',
					code:[
						iif(_access('DISTRIBUTOR_TYPE_config_SEQUENCE')==false,'SEQUENCE',null),
						iif(_access('DISTRIBUTOR_TYPE_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
					]
				},'->',{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'DISTRIBUTOR_TYPE.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('DISTRIBUTOR_TYPE.input.panel').qReset();
						Ext.getCmp('DISTRIBUTOR_TYPE.input.p').setValue('ADD');
						Ext.getCmp('DISTRIBUTOR_TYPE.list').hide();
						Ext.getCmp('DISTRIBUTOR_TYPE.input').show();
						if(getSetting('DISTRIBUTOR_TYPE','SEQUENCE')=='Y'){
							Ext.getCmp('DISTRIBUTOR_TYPE.input.f1').setReadOnly(true);
							Ext.getCmp('DISTRIBUTOR_TYPE.input.f2').focus();
						}else{
							Ext.getCmp('DISTRIBUTOR_TYPE.input.f1').setReadOnly(false);
							Ext.getCmp('DISTRIBUTOR_TYPE.input.f1').focus();
						}
						Ext.getCmp('DISTRIBUTOR_TYPE.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'DISTRIBUTOR_TYPE.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'DISTRIBUTOR_TYPE.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Nama Jenis'},
								{id:'f1',text:'Kode Jenis'},
								{id:'f3',text:'Deskripsi'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('DISTRIBUTOR_TYPE.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'DISTRIBUTOR_TYPE.text',
							press:{
								enter:function(){
									_click('DISTRIBUTOR_TYPE.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian [F5]',
							id:'DISTRIBUTOR_TYPE.btnSearch',
							handler : function(a) {
								Ext.getCmp('DISTRIBUTOR_TYPE.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'DISTRIBUTOR_TYPE.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('DISTRIBUTOR_TYPE.search').show();
						Ext.getCmp('DISTRIBUTOR_TYPE.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text: 'Kode Jenis',width: 120, dataIndex: 'f1' },
				{ text: 'Nama Jenis',width: 200,dataIndex: 'f2'},
				{ text:'Deskripsi',flex: true,dataIndex: 'f3' },
				{ xtype:'active',dataIndex: 'f4'},{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('DISTRIBUTOR_TYPE.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('DISTRIBUTOR_TYPE.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'DISTRIBUTOR_TYPE.input',
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
									_click('DISTRIBUTOR_TYPE.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('DISTRIBUTOR_TYPE.input.btnClose');
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
					text:'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'DISTRIBUTOR_TYPE.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('DISTRIBUTOR_TYPE.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('DISTRIBUTOR_TYPE.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'DISTRIBUTOR_TYPE.close',
								onY : function() {
									Ext.getCmp('DISTRIBUTOR_TYPE.input').hide();
									Ext.getCmp('DISTRIBUTOR_TYPE.list').show();
								}
							});
						}else{
							Ext.getCmp('DISTRIBUTOR_TYPE.input').hide();
							Ext.getCmp('DISTRIBUTOR_TYPE.list').show();
						}
					}
				},'->','<b>Input Jenis Vendor</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'DISTRIBUTOR_TYPE.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('DISTRIBUTOR_TYPE.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('DISTRIBUTOR_TYPE.confirm').confirm({
								msg : 'Apakah akan menyimpan data ini ?',
								allow : 'DISTRIBUTOR_TYPE.save',
								onY : function() {
									var param = Ext.getCmp('DISTRIBUTOR_TYPE.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=DISTRIBUTOR_TYPE&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('DISTRIBUTOR_TYPE.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('DISTRIBUTOR_TYPE.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('DISTRIBUTOR_TYPE.input').hide();
												Ext.getCmp('DISTRIBUTOR_TYPE.list').show();
												Ext.getCmp('DISTRIBUTOR_TYPE.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('DISTRIBUTOR_TYPE.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else if(req==true){
							if(Ext.getCmp('DISTRIBUTOR_TYPE.input.p').getValue()=='ADD'){
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
					submit:'DISTRIBUTOR_TYPE.input.btnSave',
					id : 'DISTRIBUTOR_TYPE.input.panel',
					width: 350,
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'DISTRIBUTOR_TYPE.input.p'
						},{
							xtype:'ihiddenfield',
							name:'i',
							id:'DISTRIBUTOR_TYPE.input.i'
						},{
							xtype:'itextfield',
							maxLength:32,
							submit:'DISTRIBUTOR_TYPE.input.panel',
							fieldLabel:'Kode Jenis',
							name:'f1',
							property:{
								upper:true,
								space:false
							},
							id:'DISTRIBUTOR_TYPE.input.f1',
							allowBlank: false
						},{
							xtype:'itextfield',
							name:'f2',
							submit:'DISTRIBUTOR_TYPE.input.panel',
							fieldLabel:'Nama Jenis',
							property:{
								dynamic:true
							},
							id:'DISTRIBUTOR_TYPE.input.f2',
							allowBlank: false
						},{
							xtype:'itextarea',
							name:'f3',
							submit:'DISTRIBUTOR_TYPE.input.panel',
							fieldLabel:'Deksripsi',
							property:{
								dynamic:true
							},
							id:'DISTRIBUTOR_TYPE.input.f3'
						},{
							xtype:'icheckbox',
							name:'f4',
							submit:'DISTRIBUTOR_TYPE.input.panel',
							fieldLabel:'Aktif',
							id:'DISTRIBUTOR_TYPE.input.f4',
							checked:true
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('DISTRIBUTOR_TYPE.input.panel').qGetForm() == false)
					Ext.getCmp('DISTRIBUTOR_TYPE.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang sudah berubah?',
						allow : 'DISTRIBUTOR_TYPE.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},
		{xtype:'iconfirm',id : 'DISTRIBUTOR_TYPE.confirm'}
	]
});