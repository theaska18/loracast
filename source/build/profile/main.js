/*
	import cmp.ifotoupload
	import cmp.ipanel
	import cmp.idynamicoption
	import cmp.idatefield
	import cmp.itextarea
	import cmp.iinput
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'ctrl+s',
			fn:function(){
				_click('PROFILE.btnSave');
			}
		}
	]
});
new Ext.Panel({
	id : 'PROFILE.main',
	layout:'fit',
	border:false,
	tbar:[
	    {
			xtype:'button',
	    	text:'Edit Profile',
	    	id:'PROFILE.btnEdit',
	    	iconCls:'fa fa-edit',
	    	handler:function(){
	    		Ext.getCmp('PROFILE.btnEdit').disable();
	    		Ext.getCmp('PROFILE.btnSave').enable();
	    		Ext.getCmp('PROFILE.btnChangeUsername').disable();
	    		Ext.getCmp('PROFILE.btnPassword').disable();
	    		Ext.getCmp('PROFILE.firstName').setReadOnly(false);
	    		Ext.getCmp('PROFILE.secondName').setReadOnly(false);
	    		Ext.getCmp('PROFILE.lastName').setReadOnly(false);
	    		Ext.getCmp('PROFILE.gender').setReadOnly(false);
	    		Ext.getCmp('PROFILE.religion').setReadOnly(false);
	    		Ext.getCmp('PROFILE.birthPlace').setReadOnly(false);
	    		Ext.getCmp('PROFILE.birthDate').setReadOnly(false);
	    		Ext.getCmp('PROFILE.address').setReadOnly(false);
	    		Ext.getCmp('PROFILE.email').setReadOnly(false);
	    		Ext.getCmp('PROFILE.phone1').setReadOnly(false);
	    		Ext.getCmp('PROFILE.phone2').setReadOnly(false);
	    		Ext.getCmp('PROFILE.fax1').setReadOnly(false);
	    		Ext.getCmp('PROFILE.fax2').setReadOnly(false);
	    		Ext.getCmp('PROFILE.foto').input=true;
	    		Ext.getCmp('PROFILE.firstName').focus();
	    	}
	    },{
			xtype:'button',
	    	text:'Simpan',
	    	id:'PROFILE.btnSave',
	    	iconCls:'fa fa-save',
	    	disabled:true,
	    	handler:function(){
	    		var req=Ext.getCmp('PROFILE.panel').qGetForm(true);
				if(req == false)
					Ext.getCmp('PROFILE.confirm').confirm({
						msg : 'Apakah Data ini akan diSimpan ?',
						allow : 'profile.saveProfile',
						onY : function() {
							Ext.getCmp('PROFILE.main').setLoading('Menyimpan Data.');
							var param = Ext.getCmp('PROFILE.panel').qParams();
							param['session']=_session_id;
							Ext.Ajax.request({
								url : url + 'cmd?m=PROFILE&f=saveProfile',
								method : 'POST',
								params:param,
								success : function(response) {
									Ext.getCmp('PROFILE.main').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										Ext.getCmp('PROFILE.main').closeProfile();
										Ext.getCmp('PROFILE.panel').qSetForm();
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('PROFILE.main').setLoading(false);
									ajaxError(jqXHR, exception);
								}
							});
						}
					});
				else if(req==true){
					Ext.getCmp('PROFILE.main').closeProfile();
				}
	    	}
	    },{
			xtype:'button',
	    	text:'Ubah Username',
	    	id:'PROFILE.btnChangeUsername',
	    	iconCls:'fa fa-edit',
	    	handler:function(){
	    		Ext.getCmp('PROFILE.username.panel').qReset();
	    		Ext.getCmp('PROFILE.username').closing = false;
	    		Ext.getCmp('PROFILE.username').show();
				Ext.getCmp('PROFILE.username.panel').qSetForm();
	    		Ext.getCmp('PROFILE.username.f1').focus();
	    	}
	    },{
			xtype:'button',
	    	text:'Ubah Password',
	    	id:'PROFILE.btnPassword',
	    	iconCls:'fa fa-edit',
	    	handler:function(){
	    		Ext.getCmp('PROFILE.password.panel').qReset();
	    		Ext.getCmp('PROFILE.password').closing = false;
	    		Ext.getCmp('PROFILE.password').show();
				Ext.getCmp('PROFILE.password.panel').qSetForm();
	    		Ext.getCmp('PROFILE.password.f1').focus();
	    	}
	    }
	],
	autoScroll:true,
	items:[
		{
			xtype:'ipanel',
			id : 'PROFILE.panel',
			layout:'column',
			// minWidth: 700,
			items:[
				{
					xtype:'form',
					columnWidth: .5,
					border:false,
					minWidth: 350,
					maxWidth: 400,
					cls:'i-transparent',
					items:[
						{
							xtype:'ihiddenfield',
							name:'i',
							id:'PROFILE.pid'
						},{
							xtype:'itextfield',
							maxLength:32,
							fieldLabel:'Nomor ID',
							name:'f1',
							property:{
								upper:true,
								space:false
							},
							id:'PROFILE.number',
							readOnly:true,
							allowBlank: false
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Awal',
							readOnly:true,
							property:{
								dynamic:true,
								space:false
							},
							id:'PROFILE.firstName',
							allowBlank: false
						},{
							xtype:'itextfield',
							name:'f3',
							fieldLabel:'Nama Tengah',
							readOnly:true,
							property:{
								dynamic:true,
								space:false
							},
							id:'PROFILE.secondName',
							allowBlank: true
						},{
							xtype:'itextfield',
							name:'f4',
							fieldLabel:'Nama Terakhir',
							readOnly:true,
							property:{
								dynamic:true,
								space:false
							},
							id:'PROFILE.lastName',
							allowBlank: true
						},{
							xtype:'iparameter',
							id : 'PROFILE.gender',
							fieldLabel:'Jenis Kelamin',
							name : 'f5',
							parameter:'GENDER',
							readOnly:true,
							allowBlank : false
						},{
							xtype:'iparameter',
							id : 'PROFILE.religion',
							fieldLabel:'Agama',
							parameter:'RELIGION',
							readOnly:true,
							name : 'f6',
							allowBlank : false
						},{
							xtype:'idynamicoption',
							name:'f7',
							readOnly:true,
							type:'DYNAMIC_CITY',
							id:'PROFILE.birthPlace',
							fieldLabel:'Tempat Lahir',
							allowBlank : false
						},{
							xtype:'idatefield',
							name:'f8',
							readOnly:true,
							fieldLabel:'Tanggal Lahir',
							id:'PROFILE.birthDate',
							allowBlank: false
						},{
							xtype:'itextarea',
							name:'f9',
							fieldLabel:'Alamat',
							readOnly:true,
							maxLength:256,
							id:'PROFILE.address'
						}
					]
				},{
					xtype:'form',
					columnWidth: .5,
					minWidth: 350,
					border:false,
					maxWidth: 400,
					cls:'i-transparent',
					items:[
						{
							xtype:'itextfield',
							name:'f10',
							readOnly:true,
							fieldLabel:'Alamat Email',
							id:'PROFILE.email',
							allowBlank: false
						},{
							xtype:'itextfield',
							name:'f11',
							maxLength:16,
							readOnly:true,
							fieldLabel:'Nomor Telepon 1',
							id:'PROFILE.phone1'
						},{
							xtype:'itextfield',
							name:'f12',
							fieldLabel:'Nomor Telepon 2',
							maxLength:16,
							readOnly:true,
							id:'PROFILE.phone2'
						},{
							xtype:'itextfield',
							name:'f13',
							fieldLabel:'Nomor Fax 1',
							readOnly:true,
							maxLength:16,
							id:'PROFILE.fax1'
						},{
							xtype:'itextfield',
							name:'f14',
							fieldLabel:'Nomor Fax 2',
							readOnly:true,
							maxLength:16,
							id:'PROFILE.fax2'
						},{
							xtype:'iinput',
							label:'Foto',
							items:[
								{
									xtype:'ifotoupload',
									name: 'f15',
									id:'PROFILE.foto',
									face:true,
									input:false
								}
							]
						}
					]
				}
			]
		},{xtype:'iconfirm',id : 'PROFILE.confirm'},
		{
			xtype:'iwindow',
			iconCls:'fa fa-desktop',
			id:'PROFILE.password',
			title:'Ubah Kata Sandi',
			modal:true,
			closing : false,
			listeners:{
				show:function(){
					shortcut.set({
						code:'inputPassword',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('PROFILE.password.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('PROFILE.password.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('inputPassword');
				}
			},
			items:[
				{
					xtype:'ipanel',
					id : 'PROFILE.password.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							maxLength:32,
							name:'f1',
							id:'PROFILE.password.f1',
							inputType: 'password' ,
							fieldLabel:'Password Baru',
							allowBlank: false
						},{
							xtype:'itextfield',
							maxLength:32,
							name:'f2',
							id:'PROFILE.password.f2',
							fieldLabel:'Username',
							allowBlank: false
						},{
							xtype:'itextfield',
							maxLength:32,
							name:'f3',
							id:'PROFILE.password.f3',
							inputType: 'password' ,
							fieldLabel:'Password Lama',
							allowBlank: false
						}
					]
				}
			],
			fbar:[
				{
					xtype:'button',
					text:'Simpan',
					id:'PROFILE.password.btnSave',
					iconCls:'fa fa-save',
					handler:function(){
						var req=Ext.getCmp('PROFILE.password.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('PROFILE.confirm').confirm({
								msg : 'Apakah akan menyimpan Data ini ?',
								allow : 'PROFILE.saveProfile',
								onY : function() {
									Ext.getCmp('PROFILE.password').setLoading('Menyimpan Sandi. ');
									var param = Ext.getCmp('PROFILE.password.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=PROFILE&f=savePassword',
										method : 'POST',
										params:param,
										success : function(response) {
											Ext.getCmp('PROFILE.password').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('PROFILE.password').qClose();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('PROFILE.password').setLoading(false);
											ajaxError(jqXHR, exception);
										}
									});
								}
							});
					}
				},{
					text: 'Batal',
					iconCls:'fa fa-close',
					handler: function(a,b) {
						Ext.getCmp('PROFILE.password').close();
					}
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('PROFILE.password.panel').qGetForm() == false)
					Ext.getCmp('PROFILE.confirm').confirm({
						msg :'Apakah akan mengabaikan Data yang sudah berubah ?',
						allow : 'home.closePassword',
						onY : function() {
							$this.qClose();
							Ext.getCmp('PROFILE.main').closeProfile();
						}
					});
				else{
					$this.qClose();
				}
				return false;
			}
		},{
			xtype:'iwindow',
			iconCls:'fa fa-desktop',
			id:'PROFILE.username',
			title:'Ubah Kode Pengguna',
			modal:true,
			closing : false,
			listeners:{
				show:function(){
					shortcut.set({
						code:'inputUsername',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('PROFILE.username.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click(username);
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('inputUsername');
				}
			},
			items:[
				{
					xtype:'ipanel',
					id : 'PROFILE.username.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							maxLength:32,
							name:'f1',
							fieldLabel:'Username Baru',
							id:'PROFILE.username.f1',
							property:{
								lower:true,
								space:false
							},
							allowBlank: false
						},{
							xtype:'itextfield',
							maxLength:32,
							name:'f2',
							id:'PROFILE.username.f2',
							fieldLabel:'Username Lama',
							allowBlank: false
						},{
							xtype:'itextfield',
							maxLength:32,
							name:'f3',
							id:'PROFILE.username.f3',
							inputType: 'password' ,
							fieldLabel:'Password',
							allowBlank: false
						}
					]
				}
			],
			fbar:[
				{
					xtype:'button',
					text:'Simpan',
					id:'PROFILE.username.btnSave',
					iconCls:'fa fa-save',
					handler:function(){
						var req=Ext.getCmp('PROFILE.username.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('PROFILE.confirm').confirm({
								msg : 'Apakah akan menyimpan Data ini ?',
								allow : 'PROFILE.saveUsername',
								onY : function() {
									Ext.getCmp('PROFILE.username').setLoading('Menyimpan Kode Pengguna');
									var param = Ext.getCmp('PROFILE.username.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=PROFILE&f=saveUsername',
										method : 'POST',
										params:param,
										success : function(response) {
											Ext.getCmp('PROFILE.username').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												_user_code=Ext.getCmp('PROFILE.username.f1').getValue();
												Ext.getCmp('PROFILE.username').qClose();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('PROFILE.username').setLoading(false);
											ajaxError(jqXHR, exception);
										}
									});
								}
							});
					}
				},{
					text: 'Batal',
					iconCls:'fa fa-close',
					handler: function(a,b) {
						Ext.getCmp('PROFILE.username').close();
					}
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('PROFILE.username.panel').qGetForm() == false)
					Ext.getCmp('PROFILE.confirm').confirm({
						msg :'Apakah akan mengabaikan Data yang sudah berubah ?',
						allow : 'PROFILE.closeUsername',
						onY : function() {
							$this.qClose();
						}
					});
				else{
					$this.qClose();
					Ext.getCmp('PROFILE.main').closeProfile();
				}
				return false;
			}
		}
	],
    closeProfile:function(){
		Ext.getCmp('PROFILE.btnEdit').enable();
		Ext.getCmp('PROFILE.btnSave').disable();
		Ext.getCmp('PROFILE.btnChangeUsername').enable();
		Ext.getCmp('PROFILE.btnPassword').enable();
		Ext.getCmp('PROFILE.firstName').setReadOnly(true);
		Ext.getCmp('PROFILE.secondName').setReadOnly(true);
		Ext.getCmp('PROFILE.lastName').setReadOnly(true);
		Ext.getCmp('PROFILE.gender').setReadOnly(true);
		Ext.getCmp('PROFILE.religion').setReadOnly(true);
		Ext.getCmp('PROFILE.birthPlace').setReadOnly(true);
		Ext.getCmp('PROFILE.birthDate').setReadOnly(true);
		Ext.getCmp('PROFILE.address').setReadOnly(true);
		Ext.getCmp('PROFILE.email').setReadOnly(true);
		Ext.getCmp('PROFILE.phone1').setReadOnly(true);
		Ext.getCmp('PROFILE.phone2').setReadOnly(true);
		Ext.getCmp('PROFILE.fax1').setReadOnly(true);
		Ext.getCmp('PROFILE.foto').input=false;
		Ext.getCmp('PROFILE.fax2').setReadOnly(true);
    }
});