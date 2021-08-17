/*
	import cmp.ipanel
	import cmp.icombobox
	import cmp.itable
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('MEASUREMENT.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('MEASUREMENT.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('MEASUREMENT.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('MEASUREMENT.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'MEASUREMENT.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'MEASUREMENT.search',
			modal:false,
			title:'Satuan - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('MEASUREMENT.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('MEASUREMENT.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('MEASUREMENT.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('MEASUREMENT.search.f1').focus();
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
					id:'MEASUREMENT.search.btnSearch',
					handler: function() {
						Ext.getCmp('MEASUREMENT.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'MEASUREMENT.search.btnReset',
					handler: function() {
						Ext.getCmp('MEASUREMENT.search.panel').qReset();
					}
				},{
					text: 'Close',
					tooltip:'Close <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('MEASUREMENT.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'MEASUREMENT.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'kode Satuan',
							press:{
								enter:function(){
									_click('MEASUREMENT.search.btnSearch');
								}
							},
							id:'MEASUREMENT.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Satuan',
							press:{
								enter:function(){
									_click('MEASUREMENT.search.btnSearch');
								}
							}
						},{
							xtype:'iparameter',
							parameter:'MEASUREMENT_TYPE',
							name : 'f3',
							press:{
								enter:function(){
									_click('MEASUREMENT.search.btnSearch');
								}
							},
							fieldLabel:'Jenis Satuan'
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f4',
							width: 200,
							press:{
								enter:function(){
									_click('MEASUREMENT.search.btnSearch');
								},
							},
							fieldLabel: 'Aktif'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'MEASUREMENT.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('MEASUREMENT.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('MEASUREMENT.dropdown').getValue()]=Ext.getCmp('MEASUREMENT.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=MEASUREMENT&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('MEASUREMENT_DELETE',function(){
						Ext.getCmp('MEASUREMENT.confirm').confirm({
							msg :"Apakah akan hapus Kode Satuan '"+a.f1+"' ?",
							allow : 'MEASUREMENT.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=MEASUREMENT&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('MEASUREMENT.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('MEASUREMENT.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('MEASUREMENT.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('MEASUREMENT.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('MEASUREMENT_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=MEASUREMENT&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('MEASUREMENT.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('MEASUREMENT.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('MEASUREMENT.input.panel').qReset();
									Ext.getCmp('MEASUREMENT.input.f1').setReadOnly(true);
									Ext.getCmp('MEASUREMENT.input.f1').setValue(a.f1);
									Ext.getCmp('MEASUREMENT.input.f2').setValue(a.f2);
									Ext.getCmp('MEASUREMENT.input.f3').setValue(o.f3);
									Ext.getCmp('MEASUREMENT.input.f4').setValue(o.f4);
									Ext.getCmp('MEASUREMENT.input.i').setValue(a.i);
									Ext.getCmp('MEASUREMENT.input.p').setValue('UPDATE');
									Ext.getCmp('MEASUREMENT.list').hide();
									Ext.getCmp('MEASUREMENT.input').show();
									Ext.getCmp('MEASUREMENT.input.f2').focus();
									Ext.getCmp('MEASUREMENT.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('MEASUREMENT.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
					
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('MEASUREMENT.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('MEASUREMENT.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Satuan</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'->',{
				text: 'Tambah',
				tooltip:'Tambah <b>[F6]</b>',
				id:'MEASUREMENT.btnAdd',
				iconCls: 'fa fa-plus fa-green',
				handler:function(a){
					Ext.getCmp('MEASUREMENT.input.panel').qReset();
					Ext.getCmp('MEASUREMENT.input.f1').setReadOnly(false);
					Ext.getCmp('MEASUREMENT.input.p').setValue('ADD');
					Ext.getCmp('MEASUREMENT.list').hide();
					Ext.getCmp('MEASUREMENT.input').show();
					Ext.getCmp('MEASUREMENT.input.f1').focus();
					Ext.getCmp('MEASUREMENT.input.panel').qSetForm();
				}
			},{
				xtype:'buttongroup',
				id:'MEASUREMENT.group.search',
				hidden:_mobile,
				items:[
					{
						xtype:'icombobox',
							id : 'MEASUREMENT.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Nama Satuan'},
								{id:'f1',text:'Kode Satuan'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('MEASUREMENT.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'MEASUREMENT.text',
							press:{
								enter:function(){
									_click('MEASUREMENT.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian [F5]',
							id:'MEASUREMENT.btnSearch',
							handler : function(a) {
								Ext.getCmp('MEASUREMENT.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'MEASUREMENT.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('MEASUREMENT.search').show();
						Ext.getCmp('MEASUREMENT.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text: 'Kode Satuan',width: 120, dataIndex: 'f1' },
				{ text: 'Nama Satuan',dataIndex: 'f2'},
				{ text: 'Jenis Satuan',width: 150,dataIndex: 'f3' },
				{ xtype: 'active',dataIndex: 'f4'},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('MEASUREMENT.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('MEASUREMENT.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'MEASUREMENT.input',
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
									_click('MEASUREMENT.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('MEASUREMENT.input.btnClose');
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
					id:'MEASUREMENT.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('MEASUREMENT.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('MEASUREMENT.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'MEASUREMENT.close',
								onY : function() {
									Ext.getCmp('MEASUREMENT.input').hide();
									Ext.getCmp('MEASUREMENT.list').show();
								}
							});
						}else{
							Ext.getCmp('MEASUREMENT.input').hide();
							Ext.getCmp('MEASUREMENT.list').show();
						}
					}
				},'->','<b>Input Satuan</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'MEASUREMENT.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('MEASUREMENT.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('MEASUREMENT.confirm').confirm({
								msg : 'Apakah akan menyimpan data ini?',
								allow : 'MEASUREMENT.save',
								onY : function() {
									var param = Ext.getCmp('MEASUREMENT.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=MEASUREMENT&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('MEASUREMENT.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('MEASUREMENT.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('MEASUREMENT.input').hide();
												Ext.getCmp('MEASUREMENT.list').show();
												Ext.getCmp('MEASUREMENT.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('MEASUREMENT.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else if(req==true){
							Ext.getCmp('MEASUREMENT.input').hide();
							Ext.getCmp('MEASUREMENT.list').show();
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					submit:'MEASUREMENT.input.btnSave',
					id : 'MEASUREMENT.input.panel',
					width: 350,
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'MEASUREMENT.input.p'
						},{
							xtype:'ihiddenfield',
							name:'i',
							id:'MEASUREMENT.input.i'
						},{
							xtype:'itextfield',
							maxLength:32,
							submit:'MEASUREMENT.input.panel',
							fieldLabel:'Kode Satuan',
							name:'f1',
							property:{
								upper:true,
								space:false
							},
							id:'MEASUREMENT.input.f1',
							allowBlank: false
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Satuan',
							submit:'MEASUREMENT.input.panel',
							property:{
								dynamic:true
							},
							id:'MEASUREMENT.input.f2',
							allowBlank: false
						},{
							xtype:'iparameter',
							id : 'MEASUREMENT.input.f3',
							submit:'MEASUREMENT.input.panel',
							fieldLabel:'Jenis Satuan',
							name : 'f3',
							parameter:'MEASUREMENT_TYPE',
							allowBlank : false
						},{
							xtype:'icheckbox',
							name:'f4',
							submit:'MEASUREMENT.input.panel',
							fieldLabel:'Aktif',
							id:'MEASUREMENT.input.f4',
							checked:true
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('MEASUREMENT.input.panel').qGetForm() == false)
					Ext.getCmp('MEASUREMENT.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang telah diubah?',
						allow : 'MEASUREMENT.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},{xtype:'iconfirm',id : 'MEASUREMENT.confirm'}
	]
});