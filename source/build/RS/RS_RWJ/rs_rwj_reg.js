shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('RS_RWJ_REG.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('RS_RWJ_REG.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('RS_RWJ_REG.btnShowSearch');
			}
		},{
			key:'f9',
			fn:function(){
				_click('RS_RWJ_REG.btnAdd');
			}
		}
	]
});
Ext.create('App.cmp.Panel', {
	id : 'RS_RWJ_REG.main',
	paddingBottom:false,
	layout:'fit',
	items : [
		Ext.create('App.cmp.Window',{
			iconCls:'i-zoom',
			id:'RS_RWJ_REG.search',
			modal:false,
			title:_lang.main.RS_RWJ_REG+' - '+_lang.main.SEARCHING,
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('RS_RWJ_REG.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('RS_RWJ_REG.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('RS_RWJ_REG.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('RS_RWJ_REG.search.f1').focus();
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
					id:'RS_RWJ_REG.search.btnSearch',
					handler: function() {
						Ext.getCmp('RS_RWJ_REG.list').refresh();
					}
				},{
					text: _lang.main.RESET,
					tooltip:_lang.main.RESET+' <b>[Ctrl+r]</b>',
					iconCls:'i-page',
					id:'RS_RWJ_REG.search.btnReset',
					handler: function() {
						Ext.getCmp('RS_RWJ_REG.search.panel').qReset();
					}
				},{
					text: _lang.main.EXIT,
					tooltip:_lang.main.EXIT+' <b>[Esc]</b>',
					iconCls:'i-cancel',
					handler: function() {
						Ext.getCmp('RS_RWJ_REG.search').close();
					}
				}
			],
			items:[
				new Ext.create('App.cmp.Panel',{
					id : 'RS_RWJ_REG.search.panel',
					width: 350,
					items:[
						new Ext.create('App.cmp.TextField',{
							name:'f1',
							fieldLabel:_lang.RS_RWJ_REG.CODE,
							press:{
								enter:function(){
									_click('RS_RWJ_REG.search.btnSearch');
								}
							},
							id:'RS_RWJ_REG.search.f1'
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f2',
							fieldLabel:_lang.RS_RWJ_REG.NAME,
							press:{
								enter:function(){
									_click('RS_RWJ_REG.search.btnSearch');
								}
							},
							id:'RS_RWJ_REG.search.f2'
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f3',
							fieldLabel:_lang.RS_RWJ_REG.DESC,
							press:{
								enter:function(){
									_click('RS_RWJ_REG.search.btnSearch');
								}
							},
							id:'RS_RWJ_REG.search.f3'
						}),
						new Ext.create('App.cmp.DropDown', {
							id : 'RS_RWJ_REG.search.f4',
							parameter:'ACTIVE_FLAG',
							name : 'f4',
							width: 200,
							press:{
								enter:function(){
									_click('RS_RWJ_REG.search.btnSearch');
								},
							},
							fieldLabel: _lang.main.ACTIVE
						})
					]
				})
			]
		}),
		Ext.create('App.cmp.Table',{
			id:'RS_RWJ_REG.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('RS_RWJ_REG.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('RS_RWJ_REG.dropdown').getValue()]=Ext.getCmp('RS_RWJ_REG.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=RS_RWJ_REG&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('RS_RWJ_REG_DELETE',function(){
						Ext.getCmp('RS_RWJ_REG.confirm').confirm({
							msg : _langLine(_lang.main.MSG_DELETE,{'param1':_lang.RS_RWJ_REG.CODE,'param2':a.f1}),
							allow : 'RS_RWJ_REG.delete',
							onY : function() {
								Ext.getCmp('RS_RWJ_REG.list').setLoading(_langLine(_lang.main.MSG_DELETING,{'param1':_lang.RS_RWJ_REG.CODE+' '+a.f1}));
								Ext.Ajax.request({
									url : url + 'cmd?m=RS_RWJ_REG&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									success : function(response) {
										Ext.getCmp('RS_RWJ_REG.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('RS_RWJ_REG.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('RS_RWJ_REG.list').setLoading(false);
										ajaxError(jqXHR, exception);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('RS_RWJ_REG_UPDATE',function(){
						Ext.getCmp('RS_RWJ_REG.list').setLoading(_langLine(_lang.main.MSG_GETTING_DATA,{'param1':_lang.RS_RWJ_REG.CODE+' '+a.f1}));
						Ext.Ajax.request({
							url : url + 'cmd?m=RS_RWJ_REG&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							success : function(response) {
								Ext.getCmp('RS_RWJ_REG.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('RS_RWJ_REG.input.panel').qReset();
									Ext.getCmp('RS_RWJ_REG.input.f1').setReadOnly(true);
									Ext.getCmp('RS_RWJ_REG.input.f1').setValue(a.f1);
									Ext.getCmp('RS_RWJ_REG.input.f2').setValue(a.f2);
									Ext.getCmp('RS_RWJ_REG.input.f3').setValue(o.f3);
									Ext.getCmp('RS_RWJ_REG.input.f4').setValue(o.f4);
									// Ext.getCmp('RS_RWJ_REG.input.f5').setValue(o.f5);
									// Ext.getCmp('RS_RWJ_REG.input.f6').setValue(o.f6);
									Ext.getCmp('RS_RWJ_REG.input.i').setValue(a.i);
									Ext.getCmp('RS_RWJ_REG.input.p').setValue('UPDATE');
									Ext.getCmp('RS_RWJ_REG.input').closing = false;
									Ext.getCmp('RS_RWJ_REG.input').setTitle(_lang.main.RS_RWJ_REG+' - '+_lang.main.UPDATE);
									Ext.getCmp('RS_RWJ_REG.input').show();
									Ext.getCmp('RS_RWJ_REG.input.f2').focus();
									Ext.getCmp('RS_RWJ_REG.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('RS_RWJ_REG.list').setLoading(false);
								ajaxError(jqXHR, exception);
							}
						});
					});
					
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('RS_RWJ_REG.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('RS_RWJ_REG.list').fn.update(a.dataRow);
				}
			},
			tbar:[new Ext.create('App.cmp.ButtonNewTab'),new Ext.create('App.cmp.ButtonFullScreen'),'-','->','-',
			{
				text: _lang.main.ADD,
				tooltip:_lang.main.ADD+' <b>[F6]</b>',
				id:'RS_RWJ_REG.btnAdd',
				iconCls: 'i-table_add',
				handler:function(a){
					Ext.getCmp('RS_RWJ_REG.input.panel').qReset();
					Ext.getCmp('RS_RWJ_REG.input.p').setValue('ADD');
					Ext.getCmp('RS_RWJ_REG.input').closing = false;
					Ext.getCmp('RS_RWJ_REG.input').show();
					Ext.getCmp('RS_RWJ_REG.input').setTitle(_lang.main.RS_RWJ_REG+' - '+_lang.main.ADD);
					Ext.getCmp('RS_RWJ_REG.input.f1').focus();
					Ext.getCmp('RS_RWJ_REG.input.panel').qSetForm();
				}
			},'-',new Ext.create('App.cmp.DropDown', {
					id : 'RS_RWJ_REG.dropdown',
					emptyText:_lang.main.SEARCHING,
					margin:false,
					value:'f2',
					data:[
						{id:'f2',text:_lang.RS_RWJ_REG.NAME},
						{id:'f1',text:_lang.RS_RWJ_REG.CODE},
						{id:'f3',text:_lang.RS_RWJ_REG.DESC},
					],
					width: 150,
					press:{
						enter:function(){
							_click('RS_RWJ_REG.btnSearch');
						}
					}
				}),new Ext.create('App.cmp.TextField',{
					width: 200,
					emptyText:_lang.main.SEARCHING,
					margin:false,
					tooltip:_lang.main.SEARCHING+' [Ctrl+f]',
					id:'RS_RWJ_REG.text',
					press:{
						enter:function(){
							_click('RS_RWJ_REG.btnSearch');
						}
					}
				}),{
					iconCls: 'i-zoom',
					tooltip:_lang.main.SEARCHING+' [F5]',
					id:'RS_RWJ_REG.btnSearch',
					handler : function(a) {
						Ext.getCmp('RS_RWJ_REG.list').refresh(false);
					}
				},'-',{
					text: _lang.main.SEARCHING,
					tooltip:_lang.main.SEARCHING+' <b>[Ctrl+Shift+f]</b>',
					id:'RS_RWJ_REG.btnShowSearch',
					iconCls: 'i-application_form_magnify',
					handler:function(a){
						Ext.getCmp('RS_RWJ_REG.search').show();
						Ext.getCmp('RS_RWJ_REG.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,hideable:false,dataIndex: 'i' },
				{ text: _lang.RS_RWJ_REG.CODE,width: 120, dataIndex: 'f1' },
				{ text: _lang.RS_RWJ_REG.NAME,width: 200,dataIndex: 'f2'},
				{ text: _lang.RS_RWJ_REG.DESC,flex: true,dataIndex: 'f3' },
				{ text: _lang.main.ACTIVE,width: 50,sortable :false,dataIndex: 'f4',align:'center',
					renderer: function(value,meta){
						if(value==true)
							return '<span class="i-icon i-flag_green"></span>';
						return '<span class="i-icon i-flag_red"></span>';
					}
				},
				{
					text: 'Edit',
					width: 55,
					menuDisabled: true,
					hideable:false,
					xtype: 'actioncolumn',
					align: 'center',
					iconCls: 'i-table_edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('RS_RWJ_REG.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					width: 55,
					menuDisabled: true,
					hideable:false,
					xtype: 'actioncolumn',
					align: 'center',
					iconCls: 'i-table_delete',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('RS_RWJ_REG.list').fn.delete(record.data);
					}
				}
				
			]
		}),
		Ext.create('App.cmp.Window',{
			iconCls:'i-application',
			id:'RS_RWJ_REG.input',
			modal : true,
			// maximized:true,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('RS_RWJ_REG.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('RS_RWJ_REG.input.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('input');
				}
			},
			fbar: [{
				text: _lang.main.SAVE,
				tooltip:_lang.main.SAVE+' <b>[Ctrl+s]</b>',
				id:'RS_RWJ_REG.input.btnSave',
				iconCls:'i-table_save',
				handler: function() {
					var req=Ext.getCmp('RS_RWJ_REG.input.panel').qGetForm(true);
					if(req == false)
						Ext.getCmp('RS_RWJ_REG.confirm').confirm({
							msg : _lang.main.MSG_SAVE,
							allow : 'RS_RWJ_REG.save',
							onY : function() {
								Ext.getCmp('RS_RWJ_REG.input').setLoading(_lang.main.MSG_SAVING);
								var param = Ext.getCmp('RS_RWJ_REG.input.panel').qParams();
								Ext.Ajax.request({
									url : url + 'cmd?m=RS_RWJ_REG&f=save',
									method : 'POST',
									params:param,
									success : function(response) {
										Ext.getCmp('RS_RWJ_REG.input').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S') {
											Ext.getCmp('RS_RWJ_REG.input').qClose();
											Ext.getCmp('RS_RWJ_REG.list').refresh();
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('RS_RWJ_REG.input').setLoading(false);
										ajaxError(jqXHR, exception);
									}
								});
							}
						});
					else if(req==true)
						Ext.getCmp('RS_RWJ_REG.input').qClose();
				}
			},{
				text: _lang.main.EXIT,
				tooltip:_lang.main.EXIT+' <b>[Esc]</b>',
				id:'RS_RWJ_REG.input.btnClose',
				iconCls:'i-cancel',
				handler: function() {
					Ext.getCmp('RS_RWJ_REG.input').close();
				}
			}],
			items:[
				new Ext.create('App.cmp.Panel',{
					id : 'RS_RWJ_REG.input.panel',
					// width: 350,
					layout:'column',
					items:[
						new Ext.create('App.cmp.HiddenField',{
							name:'p',
							id:'RS_RWJ_REG.input.p'
						}),
						new Ext.create('App.cmp.HiddenField',{
							name:'i',
							id:'RS_RWJ_REG.input.i'
						}),
						new Ext.create('App.cmp.TextField',{
							labelAlign:'top',
							fieldLabel:'No. Reg',
							name:'f1',
							readOnly:true,
							width: 80,
							id:'RS_RWJ_REG.input.f1',
						}),
						new Ext.create('App.cmp.ButtonFind',{
							windowWidth: 500,
							labelTop:true,
							id:'RS_RWJ_REG.input.btnShowUnit',
							onEnter:function(a){
								console.log(a);
								alert('enter');
								Ext.getCmp('RS_RWJ_REG.input.btnShowUnit').windowClose();
							},
							onDblClick:function(a){
								console.log(a);
								alert('click');
							},
							items:[
								new Ext.create('App.cmp.TextField',{
									name:'f6',
									fieldLabel:'Kode Unit',
									labelAlign:'top',
									database:{
										table:'rs_unit',
										field:'unit_code',
										separator:'like'
									},
									press:{
										enter:function(){
											Ext.getCmp('RS_RWJ_REG.input.btnShowUnit').refresh();
											// _click('RS_SET_UNIT.search.btnSearch');
										}
									}
								}),
								new Ext.create('App.cmp.TextField',{
									name:'f1',
									labelAlign:'top',
									// id:'RS_SET_UNIT.search.f1',
									database:{
										table:'rs_unit',
										field:'nama_unit',
										separator:'like'
									},
									fieldLabel:'Nama Unit',
									press:{
										enter:function(){
											Ext.getCmp('RS_RWJ_REG.input.btnShowUnit').refresh();
											// _click('RS_SET_UNIT.search.btnSearch');
										}
									}
								}),
								new Ext.create('App.cmp.DropDown', {
									// id : 'RS_SET_UNIT.search.f3',
									name : 'f3',
									labelAlign:'top',
									fieldLabel: 'Jenis Unit',
									database:{
										table:'rs_unit',
										field:'jenis_unit'
									},
									parameter:'RS_UNIT_TYPE',
									press:{
										enter:function(){
											Ext.getCmp('RS_RWJ_REG.input.btnShowUnit').refresh();
											// _click('RS_SET_UNIT.search.btnSearch');
										}
									}
								}),
								new Ext.create('App.cmp.DropDown', {
									// id : 'RS_SET_UNIT.search.f5',
									parameter:'ACTIVE_FLAG',
									labelAlign:'top',
									database:{
										table:'rs_unit',
										field:'m.active_flag',
										type:'active'
									},
									// name : 'f5',
									width:100,
									press:{
										enter:function(){
											Ext.getCmp('RS_RWJ_REG.input.btnShowUnit').refresh();
											// _click('RS_SET_UNIT.search.btnSearch');
										}
									},
									fieldLabel:_lang.main.ACTIVE,
								})
							],
							database:{
								table:'rs_unit',
								inner:'INNER JOIN app_parameter_option UNIT ON UNIT.option_code=M.jenis_unit'
							},
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
								}
							]
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f2',
							labelAlign:'top',
							width: 100,
							readOnly:true,
							fieldLabel:'No. Medrec',
							id:'RS_RWJ_REG.input.f2',
						}),
						new Ext.create('App.cmp.ButtonFind',{
							id:'RS_RWJ_REG.input.btnShowUnit2',
							labelTop:true,
							onEnter:function(a){
								console.log(a);
								alert('enter');
								Ext.getCmp('RS_RWJ_REG.input.btnShowUnit2').windowClose();
							},
							onDblClick:function(a){
								console.log(a);
								alert('click');
							},
							items:[
								new Ext.create('App.cmp.TextField',{
									name:'f6',
									fieldLabel:'Kode Unit',
									labelAlign:'top',
									database:{
										table:'rs_unit',
										field:'unit_code',
										separator:'like'
									},
									press:{
										enter:function(){
											Ext.getCmp('RS_RWJ_REG.input.btnShowUnit2').refresh();
											// _click('RS_SET_UNIT.search.btnSearch');
										}
									}
								}),
								new Ext.create('App.cmp.TextField',{
									name:'f1',
									labelAlign:'top',
									// id:'RS_SET_UNIT.search.f1',
									database:{
										table:'rs_unit',
										field:'nama_unit',
										separator:'like'
									},
									fieldLabel:'Nama Unit',
									press:{
										enter:function(){
											Ext.getCmp('RS_RWJ_REG.input.btnShowUnit2').refresh();
											// _click('RS_SET_UNIT.search.btnSearch');
										}
									}
								}),
								new Ext.create('App.cmp.DropDown', {
									// id : 'RS_SET_UNIT.search.f3',
									name : 'f3',
									labelAlign:'top',
									fieldLabel: 'Jenis Unit',
									database:{
										table:'rs_unit',
										field:'jenis_unit'
									},
									parameter:'RS_UNIT_TYPE',
									press:{
										enter:function(){
											Ext.getCmp('RS_RWJ_REG.input.btnShowUnit2').refresh();
											// _click('RS_SET_UNIT.search.btnSearch');
										}
									}
								}),
								new Ext.create('App.cmp.DropDown', {
									// id : 'RS_SET_UNIT.search.f5',
									parameter:'ACTIVE_FLAG',
									labelAlign:'top',
									database:{
										table:'rs_unit',
										field:'m.active_flag',
										type:'active'
									},
									// name : 'f5',
									width:100,
									press:{
										enter:function(){
											Ext.getCmp('RS_RWJ_REG.input.btnShowUnit2').refresh();
											// _click('RS_SET_UNIT.search.btnSearch');
										}
									},
									fieldLabel:_lang.main.ACTIVE,
								})
							],
							database:{
								table:'rs_unit',
								inner:'INNER JOIN app_parameter_option UNIT ON UNIT.option_code=M.jenis_unit'
							},
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
								}
							]
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f3',
							labelAlign:'top',
							allowBlank: false,
							maxLength:64,
							property:{
								dynamic:true
							},
							width: 200,
							fieldLabel:'Nama Pasien',
							id:'RS_RWJ_REG.input.f3'
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f4',
							labelAlign:'top',
							maxLength:64,
							width: 200,
							allowBlank: false,
							property:{
								dynamic:true
							},
							fieldLabel:'Nama Keluarga',
							id:'RS_RWJ_REG.input.f4'
						}),
						new Ext.create('App.cmp.DropDown', {
							id : 'RS_RWJ_REG.input.f5',
							parameter:'GENDER',
							allowBlank: false,
							labelAlign:'top',
							name : 'f5',
							width: 100,
							fieldLabel: 'Jenis Kelamin',
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f6',
							labelAlign:'top',
							fieldLabel:'NIK',
							width: 150,
							id:'RS_RWJ_REG.input.f6'
						}),
						new Ext.create('App.cmp.DynamicOption',{
							name:'f7',
							maxLength:64,
							labelAlign:'top',
							type:'DYNAMIC_CITY',
							fieldLabel:'Tempat Lahir',
							id:'RS_RWJ_REG.input.f7',
							width: 150,
							allowBlank: false
						}),
						new Ext.create('App.cmp.DateField',{
							name:'f8',
							width: 100,
							labelAlign:'top',
							fieldLabel:'Tgl. Lahir',
							id:'RS_RWJ_REG.input.f8',
							allowBlank: false
						}),
						new Ext.create('App.cmp.DropDown', {
							id : 'RS_RWJ_REG.input.f9',
							fieldLabel:'Agama',
							labelAlign:'top',
							parameter:'RELIGION',
							name : 'f9',
							allowBlank : false
						}), 
						new Ext.create('App.cmp.DropDown', {
							id : 'RS_RWJ_REG.input.f10',
							fieldLabel:'G. Darah',
							parameter:'BLOD',
							labelAlign:'top',
							width: 60,
							name : 'f10',
							allowBlank : false
						}), 
						new Ext.create('App.cmp.DynamicOption',{
							name:'f11',
							maxLength:64,
							labelAlign:'top',
							type:'DYNAMIC_STAT_MAR',
							fieldLabel:'S. Marital',
							id:'RS_RWJ_REG.input.f11',
							allowBlank: false
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f12',
							labelAlign:'top',
							fieldLabel:'Alamat',
							allowBlank: false,
							width: 300,
							id:'RS_RWJ_REG.input.f12'
						}),
						new Ext.create('App.cmp.DynamicOption',{
							name:'f13',
							maxLength:64,
							width: 150,
							labelAlign:'top',
							type:'DYNAMIC_PROV',
							fieldLabel:'Provinsi',
							id:'RS_RWJ_REG.input.f13',
							getParent:function(){
								return 'Indonesia';	
							},
							allowBlank: false
						}),
						new Ext.create('App.cmp.DynamicOption',{
							name:'f14',
							maxLength:64,
							width: 150,
							labelAlign:'top',
							type:'DYNAMIC_CITY',
							fieldLabel:'Kota',
							id:'RS_RWJ_REG.input.f14',
							getParent:function(){
								return Ext.getCmp('RS_RWJ_REG.input.f13').getValue();	
							},
							allowBlank: false
						}),
						new Ext.create('App.cmp.DynamicOption',{
							name:'f15',
							maxLength:64,
							width: 150,
							labelAlign:'top',
							type:'DYNAMIC_KEC',
							fieldLabel:'Kecamatan',
							id:'RS_RWJ_REG.input.f15',
							getParent:function(){
								return Ext.getCmp('RS_RWJ_REG.input.f14').getValue();	
							},
							allowBlank: false
						}),
						new Ext.create('App.cmp.DynamicOption',{
							name:'f16',
							maxLength:64,
							type:'DYNAMIC_KEL',
							labelAlign:'top',
							width: 150,
							fieldLabel:'Kelurahan',
							id:'RS_RWJ_REG.input.f16',
							getParent:function(){
								return Ext.getCmp('RS_RWJ_REG.input.f15').getValue();	
							},
							allowBlank: false
						}),
						new Ext.create('App.cmp.DynamicOption',{
							name:'f17',
							maxLength:64,
							width: 120,
							type:'DYNAMIC_POST_KD',
							labelAlign:'top',
							fieldLabel:'Kd. POS',
							id:'RS_RWJ_REG.input.f17',
							getParent:function(){
								return Ext.getCmp('RS_RWJ_REG.input.f16').getValue();	
							},
							allowBlank: false
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f18',
							labelAlign:'top',
							fieldLabel:'RT',
							allowBlank: false,
							width: 50,
							maxLength: 4,
							id:'RS_RWJ_REG.input.f18'
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f19',
							labelAlign:'top',
							allowBlank: false,
							fieldLabel:'RW',
							width: 50,
							maxLength: 4,
							id:'RS_RWJ_REG.input.f19'
						}),
						new Ext.create('App.cmp.DynamicOption',{
							name:'f20',
							maxLength:64,
							type:'DYNAMIC_EDU',
							labelAlign:'top',
							fieldLabel:'Pend. Terakhir',
							id:'RS_RWJ_REG.input.f20',
							allowBlank: false
						}),
						new Ext.create('App.cmp.DynamicOption',{
							name:'f21',
							maxLength:64,
							type:'DYNAMIC_JOB',
							labelAlign:'top',
							fieldLabel:'Pekerjaan',
							id:'RS_RWJ_REG.input.f21',
							allowBlank: false
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f22',
							labelAlign:'top',
							fieldLabel:'Telepon',
							width: 100,
							id:'RS_RWJ_REG.input.f22'
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f23',
							labelAlign:'top',
							fieldLabel:'Suami/Istri',
							property:{
								dynamic:true
							},
							width: 200,
							id:'RS_RWJ_REG.input.f23'
						}),
						new Ext.create('App.cmp.DynamicOption',{
							name:'f24',
							maxLength:64,
							type:'DYNAMIC_JOB',
							labelAlign:'top',
							fieldLabel:'Pekerjaan Suami/Istri',
							id:'RS_RWJ_REG.input.f24',
							allowBlank: false
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f25',
							labelAlign:'top',
							fieldLabel:'Ayah',
							property:{
								dynamic:true
							},
							width: 200,
							id:'RS_RWJ_REG.input.f25',
							allowBlank: false
						}),
						new Ext.create('App.cmp.DynamicOption',{
							name:'f26',
							maxLength:64,
							type:'DYNAMIC_JOB',
							labelAlign:'top',
							fieldLabel:'Pekerjaan Ayah',
							id:'RS_RWJ_REG.input.f26',
							allowBlank: false
						}),
						new Ext.create('App.cmp.TextField',{
							name:'f27',
							labelAlign:'top',
							fieldLabel:'Ibu',
							property:{
								dynamic:true
							},
							width: 200,
							id:'RS_RWJ_REG.input.f27',
							allowBlank: false
						}),
						new Ext.create('App.cmp.DynamicOption',{
							name:'f28',
							maxLength:64,
							type:'DYNAMIC_JOB',
							labelAlign:'top',
							fieldLabel:'Pekerjaan Ibu',
							id:'RS_RWJ_REG.input.f28',
							allowBlank: false
						}),
						new Ext.create('App.cmp.DynamicOption',{
							name:'f29',
							maxLength:64,
							labelAlign:'top',
							type:'DYNAMIC_SUKU',
							fieldLabel:'Suku',
							id:'RS_RWJ_REG.input.f29',
							allowBlank: false
						}),
						
						
					]
				})
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('RS_RWJ_REG.input.panel').qGetForm() == false)
					Ext.getCmp('RS_RWJ_REG.confirm').confirm({
						msg :_lang.main.MSG_IGNORE_THE_CHANGE,
						allow : 'RS_RWJ_REG.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		}),
		new Ext.create('App.cmp.Confirm', {id : 'RS_RWJ_REG.confirm'})
	]
});