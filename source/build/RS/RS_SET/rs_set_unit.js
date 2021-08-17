shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('RS_SET_UNIT.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('RS_SET_UNIT.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('RS_SET_UNIT.btnShowSearch');
			}
		},{
			key:'f9',
			fn:function(){
				_click('RS_SET_UNIT.btnAdd');
			}
		}
	]
});
Ext.Panel({
	id : 'RS_SET_UNIT.main',
	layout:'fit',
	border:false,
	items : [
		Ext.create('App.cmp.Window',{
			iconCls:'i-zoom',
			id:'RS_SET_UNIT.search',
			modal:false,
			title:'Unit - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('RS_SET_UNIT.search.btnClose');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('RS_SET_UNIT.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('RS_SET_UNIT.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('RS_SET_UNIT.search.f1').focus();
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
					text: _lang.main.SEARCH,
					tooltip:_lang.main.SEARCH+' <b>[Ctrl+s]</b>',
					iconCls:'i-zoom',
					id:'RS_SET_UNIT.search.btnSearch',
					handler: function() {
						Ext.getCmp('RS_SET_UNIT.list').refresh();
					}
				},{
					text: _lang.main.RESET,
					tooltip:_lang.main.RESET+' <b>[Ctrl+r]</b>',
					iconCls:'i-page',
					id:'RS_SET_UNIT.search.btnReset',
					handler: function() {
						Ext.getCmp('RS_SET_UNIT.search.panel').qReset();
					}
				},{
					text: _lang.main.EXPORT,
					iconCls: 'i-page_excel',
					handler:function(a){
						Ext.getCmp('RS_SET_UNIT.confirm').confirm({
							msg : "Apakah Akan Export Data ?",
							allow : 'RS_SET_UNIT.export',
							onY : function() {
								Ext.getCmp('RS_SET_UNIT.list').excel();
							}
						})
					}
				},{
					text: _lang.main.EXIT,
					tooltip:_lang.main.EXIT+' <b>[Esc]</b>',
					handler: function() {
						Ext.getCmp('RS_SET_UNIT.search').close();
					}
				}
			],
			items:[
				new Ext.create('App.cmp.Panel',{
					id : 'RS_SET_UNIT.search.panel',
					width: 350,
					items:[
						new Ext.create('App.cmp.TextField',{
							name:'f6',
							fieldLabel:'Kode Unit',
							id:'RS_SET_UNIT.search.f6',
							database:{
								table:'rs_unit',
								field:'unit_code',
								separator:'like'
							},
							press:{
								enter:function(){
									_click('RS_SET_UNIT.search.btnSearch');
								}
							}
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f1',
							id:'RS_SET_UNIT.search.f1',
							database:{
								table:'rs_unit',
								field:'nama_unit',
								separator:'like'
							},
							fieldLabel:'Nama Unit',
							press:{
								enter:function(){
									_click('RS_SET_UNIT.search.btnSearch');
								}
							}
						}),
						new Ext.create('App.cmp.DropDown', {
							id : 'RS_SET_UNIT.search.f3',
							name : 'f3',
							fieldLabel: 'Jenis Unit',
							database:{
								table:'rs_unit',
								field:'jenis_unit'
							},
							parameter:'RS_UNIT_TYPE',
							press:{
								enter:function(){
									_click('RS_SET_UNIT.search.btnSearch');
								}
							}
						}),
						new Ext.create('App.cmp.DropDown', {
							id : 'RS_SET_UNIT.search.f5',
							parameter:'ACTIVE_FLAG',
							database:{
								table:'rs_unit',
								field:'m.active_flag',
								type:'active'
							},
							name : 'f5',
							width:200,
							press:{
								enter:function(){
									_click('RS_SET_UNIT.search.btnSearch');
								}
							},
							fieldLabel:_lang.main.ACTIVE,
						})
					]
				})
			]
		}),
		Ext.create('App.cmp.TableGrid',{
			id:'RS_SET_UNIT.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('RS_SET_UNIT.search.panel')._parameter();
				}else{
					var obj={};
					obj['rs_unit']={};
					obj['rs_unit'][Ext.getCmp('RS_SET_UNIT.dropdown').getValue()]={
						value:Ext.getCmp('RS_SET_UNIT.text').getValue(),
						separator:'like'
					};
					obj['rs_unit']['m.active_flag']={
						value:true,
						type:'boolean',
						separator:'='
					}
					return JSON.stringify(obj);
				}
			},
			database:{
				table:'rs_unit',
				inner:'INNER JOIN app_parameter_option UNIT ON UNIT.option_code=M.jenis_unit'
			},
			fn:{
				delete:function(a){
					_access('RS_SET_UNIT_delete',function(){
						Ext.getCmp('RS_SET_UNIT.confirm').confirm({
							msg : "Apakah Akan Menghapus Kode Unit '"+a.unit_code+"' ?",
							allow : 'RS_SET_UNIT.delete',
							onY : function() {
								Ext.getCmp('RS_SET_UNIT.list').setLoading('Menghapus Kode Unit '+a.unit_code);
								Ext.Ajax.request({
									url : _url('RS_SET_UNIT','delete'),
									method : 'POST',
									params : {
										i : a.unit_id
									},
									success : function(response) {
										Ext.getCmp('RS_SET_UNIT.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('RS_SET_UNIT.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('RS_SET_UNIT.list').setLoading(false);
										ajaxError(jqXHR, exception);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('RS_SET_UNIT_update',function(){
						Ext.getCmp('RS_SET_UNIT.input').show();
						Ext.getCmp('RS_SET_UNIT.input.i').setValue(a.unit_id);
						Ext.getCmp('RS_SET_UNIT.input.panel')._load(function(){
							Ext.getCmp('RS_SET_UNIT.input.update_by').setValue(_employee_id);
							Ext.getCmp('RS_SET_UNIT.input.update_on').setValue('now()');
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('RS_SET_UNIT.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('RS_SET_UNIT.list').fn.update(a.dataRow);
				}
			},
			tbar:[new Ext.create('App.cmp.ButtonNewTab'),new Ext.create('App.cmp.ButtonFullScreen'),'-','->','-',
				{
					text: _lang.main.ADD,
					tooltip:_lang.main.ADD+' <b>[F6]</b>',
					iconCls: 'i-table_add',
					id:'RS_SET_UNIT.btnAdd',
					handler:function(a){
						Ext.getCmp('RS_SET_UNIT.input.panel').qReset();
						Ext.getCmp('RS_SET_UNIT.input').closing = false;
						Ext.getCmp('RS_SET_UNIT.input').show();
						Ext.getCmp('RS_SET_UNIT.input.f1').setReadOnly(false);
						Ext.getCmp('RS_SET_UNIT.input.f1').focus();
						Ext.getCmp('RS_SET_UNIT.input.panel').qSetForm();
					}
				},new Ext.create('App.cmp.DropDown', {
					id : 'RS_SET_UNIT.dropdown',
					emptyText:_lang.main.SEARCHING,
					value:'nama_unit',
					margin:false,
					data:[
						{id:'nama_unit',text:'Nama Unit'},
						{id:'unit_code',text:'Kode Unit'}
					],
					width: 150,
					press:{
						enter:function(){
							_click('RS_SET_UNIT.btnSearch');
						}
					}
				}),new Ext.create('App.cmp.TextField',{
					width: 200,
					emptyText:_lang.main.SEARCHING,
					margin:false,
					tooltip:_lang.main.SEARCHING+' [Ctrl+f]',
					id:'RS_SET_UNIT.text',
					press:{
						enter:function(){
							_click('RS_SET_UNIT.btnSearch');
						}
					}
				}),{
					iconCls: 'i-zoom',
					tooltip:_lang.main.SEARCHING+' [F5]',
					id:'RS_SET_UNIT.btnSearch',
					handler : function(a) {
						Ext.getCmp('RS_SET_UNIT.list').refresh(false);
					}
				},{
					iconCls: 'i-page_excel',
					handler:function(a){
						Ext.getCmp('RS_SET_UNIT.confirm').confirm({
							msg : _lang.amin.MSG_EXPORT,
							allow : 'RS_SET_UNIT.export',
							onY : function() {
								Ext.getCmp('RS_SET_UNIT.list').excel(false);
							}
						})
					}
				},'-',{
					text: _lang.main.SEARCHING,
					tooltip:_lang.main.SEARCHING+' <b>[Ctrl+Shift+f]</b>',
					iconCls: 'i-application_form_magnify',
					id:'RS_SET_UNIT.btnShowSearch',
					handler:function(a){
						Ext.getCmp('RS_SET_UNIT.search').show();
						Ext.getCmp('RS_SET_UNIT.search.f6').focus();
					}
				}
			],
			columns:[
				{ hidden:true,hideable:false,dataIndex: 'unit_id',database:{field:'unit_id'} },
				{ text: 'Kode Unit',width: 80, align:'center',dataIndex: 'unit_code',database:{field:'unit_code'}  },
				{ text: 'Nama Unit',width:200, dataIndex: 'nama_unit',database:{field:'nama_unit'}  },
				{ text: 'Kode Unit PBJS',flex: 1, dataIndex: 'bpjs_code',database:{field:'bpjs_code'}  },
				{ text: 'Jenis Unit',width: 100, dataIndex: 'jenis',database:{field:'UNIT.option_name AS jenis'}  },
				{ text: _lang.main.ACTIVE,width: 50,sortable :false,dataIndex: 'active_flag',align:'center',database:{field:'m.active_flag'} ,
					renderer: function(value){
						if(value==true)
							return '<span class="i-icon i-flag_green"></span>';
						return '<span class="i-icon i-flag_red"></span>';
					}
				},{
					text:  _lang.main.UPDATE,
					width: 50,
					hideable:false,
					menuDisabled: true,
					xtype: 'actioncolumn',
					align: 'center',
					iconCls: 'i-table_edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('RS_SET_UNIT.list').fn.update(record.data);
					}
				},{
					text: _lang.main.DELETE,
					width: 50,
					hideable:false,
					menuDisabled: true,
					xtype: 'actioncolumn',
					align: 'center',
					iconCls: 'i-table_delete',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('RS_SET_UNIT.list').fn.delete(record.data);
					}
				}
			]
		}),
		Ext.create('App.cmp.Window',{
			iconCls:'i-application',
			id:'RS_SET_UNIT.input',
			title:'Unit',
			closing : false,
			modal : true,
			fbar: [{
				text: 'Simpan',
				id:'RS_SET_UNIT.input.btnSave',
				iconCls:'i-table_save',
				handler: function() {
					var req=Ext.getCmp('RS_SET_UNIT.input.panel').qGetForm(true);
					if(req == false)
						Ext.getCmp('RS_SET_UNIT.input.panel')._save(function(){
							Ext.getCmp('RS_SET_UNIT.input').qClose();
							Ext.getCmp('RS_SET_UNIT.list').refresh(false);
						});
					else if(req==true)
						Ext.getCmp('RS_SET_UNIT.input').qClose();
				}
			},{
				text: 'Keluar',
				iconCls:'i-cancel',
				handler: function() {
					Ext.getCmp('RS_SET_UNIT.input').close();
				}
			}],
			layout:'fit',
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('RS_SET_UNIT.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('RS_SET_UNIT.input.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('input');
				}
			},
			items:[
				new Ext.create('App.cmp.Panel',{
					id : 'RS_SET_UNIT.input.panel',
					width: 350,
					database:{
						command:{
							rs_unit:{
								primary:'unit_id',
								unique:[{field:'tenant_id',type:'double'},{field:'unit_code',name:'Kode Unit'}]
							}
						}
					},
					items:[
						new Ext.create('App.cmp.HiddenField',{
							name:'p',
							id:'RS_SET_UNIT.input.p'
						}),
						new Ext.create('App.cmp.HiddenField',{
							name:'i',
							id:'RS_SET_UNIT.input.i',
							database:{
								table:'rs_unit',
								field:'unit_id',
								type:'double'
							}
						}),
						new Ext.create('App.cmp.HiddenField',{
							name:'tenant_id',
							value:_tenant_id,
							id:'RS_SET_UNIT.input.tenant_id',
							database:{
								table:'rs_unit',
								field:'tenant_id',
								type:'double'
							}
						}),
						new Ext.create('App.cmp.HiddenField',{
							name:'update_by',
							value:null,
							id:'RS_SET_UNIT.input.update_by',
							database:{
								table:'rs_unit',
								field:'update_by',
								type:'double'
							}
						}),
						new Ext.create('App.cmp.HiddenField',{
							name:'create_by',
							value:_employee_id,
							id:'RS_SET_UNIT.input.create_by',
							database:{
								table:'rs_unit',
								field:'create_by',
								type:'double'
							}
						}),
						new Ext.create('App.cmp.HiddenField',{
							name:'create_on',
							value:'now()',
							id:'RS_SET_UNIT.input.create_on',
							database:{
								table:'rs_unit',
								field:'create_on'
							}
						}),
						new Ext.create('App.cmp.HiddenField',{
							name:'update_on',
							value:'now()',
							id:'RS_SET_UNIT.input.update_on',
							database:{
								table:'rs_unit',
								field:'update_on',
								type:'datetime'
							}
						}),
						new Ext.create('App.cmp.TextField',{
							maxLength:32,
							name:'f1',
							fieldLabel:'Kode Unit',
							database:{
								table:'rs_unit',
								field:'unit_code'
							},
							id:'RS_SET_UNIT.input.f1',
							allowBlank: false,
							property:{
								upper:true,
								space:false
							}
						}),
						new Ext.create('App.cmp.TextField',{
							maxLength:64,
							name:'f2',
							fieldLabel:'Nama Unit',
							database:{
								table:'rs_unit',
								field:'nama_unit'
							},
							id:'RS_SET_UNIT.input.f2',
							allowBlank: false,
							property:{
								dynamic:true
							}
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f3',
							fieldLabel:'Kode BPJS',
							maxLength:32,
							database:{
								table:'rs_unit',
								field:'bpjs_code'
							},
							id:'RS_SET_UNIT.input.f3'
						}),
						new Ext.create('App.cmp.DropDown', {
							id : 'RS_SET_UNIT.search.f4',
							name : 'f4',
							allowBlank: false,
							fieldLabel:'Jenis Unit',
							database:{
								table:'rs_unit',
								field:'jenis_unit'
							},
							parameter:'RS_UNIT_TYPE'
						}),
						new Ext.create('App.cmp.CheckBox',{
							name:'f5',
							fieldLabel:_lang.main.ACTIVE,
							checked:true,
							database:{
								table:'rs_unit',
								field:'active_flag'
							},
							id:'RS_SET_UNIT.input.f5'
						})
					]
				})
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('RS_SET_UNIT.input.panel').qGetForm() == false)
					Ext.getCmp('RS_SET_UNIT.confirm').confirm({
						msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
						allow : 'RS_SET_UNIT.close',
						onY : function() {
							$this.qClose();

						}
					});
				else
					$this.qClose();
				return false;
			}
		}),
		new Ext.create('App.cmp.Confirm', {id : 'RS_SET_UNIT.confirm'})
	]
});
