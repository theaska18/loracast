_var.Setting={id:null};
Ext.define('App.cmp.Setting',{
	extend:'App.cmp.Table',
	autoRefresh:false,
	level:0,
	tenant_id:null,
	menu_code:null,
	role_id:null,
	user_id:null,
	code:[],
	setting_list:'',
	params:function(bo,$this){
		var arr={};
		arr['level']=$this.level;
		arr['menu_code']=$this.menu_code;
		arr['tenant_id']=$this.tenant_id;
		arr['role_id']=$this.role_id;
		arr['user_id']=$this.user_id;
		arr['code']=JSON.stringify($this.code);
		return arr;
	},
	url:url + 'cmp/getSettingList',
	result:function(response){
		return {list:response.d,total:response.t};
	},
	initComponent(){
		var $this=this;
		_var.Setting.id=$this.id;
		$this.save=function(level,menu_code,setting_code,value,result,tenant_id,role_id,user_id){
			Ext.Ajax.request({
				url : url + 'cmp/saveSetting',
				method : 'POST',
				params:{
					level:level,menu_code:menu_code,setting_code:setting_code,value:value,
					result:result,tenant_id:tenant_id,role_id:role_id,user_id:user_id
				},
				success : function(response) {
					var r = ajaxSuccess(response);
					if (r.r == 'S'){
						if(_setting[menu_code] != undefined && _setting[menu_code] != null){
							if(_setting[menu_code][setting_code] != undefined){
								_setting[menu_code][setting_code]=r.d;
							}
						}
						
					}
				},
				failure : function(jqXHR, exception) {ajaxError(jqXHR, exception);}
			});
		}
		$this.columns=[
			{ xtype: 'rownumberer'},
			{ hidden:true,dataIndex: 'i' },
			{ hidden:true,dataIndex: 'f3' },
			{ text: 'Setting',width:200,dataIndex: 'f1',menuDisabled:true},
			{ text: 'Value',flex:1,dataIndex: 'f2'},
			{
				text: 'Ubah',
				xtype: 'actioncolumn',
				iconCls: 'fa fa-edit',
				handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
					Ext.Ajax.request({
						url : url + 'cmp/initSetting',
						method : 'GET',
						params : {
							level:$this.level,
							menu_code:$this.menu_code,
							tenant_id:$this.tenant_id,
							role_id:$this.role_id,
							user_id:$this.user_id,
							setting_code:record.data.i,
						},
						before:function(){
							grid.setLoading(true);
						},
						success : function(response) {
							grid.setLoading(false);
							var r = ajaxSuccess(response);
							if (r.r == 'S') {
								var d=r.d;
								var input=null;
								if(d.type=='INPUT_TYPE_STRING'){
									input={
										xtype:'itextarea',
										id:$this.id+'input',
										value:d.value,
										fieldLabel:record.data.f1,
										listeners:{
											blur:function(a){
												$this.save($this.level,$this.menu_code,record.data.i,a.getValue(),null,$this.tenant_id,$this.role_id,$this.user_id);
											}
										}
									};
								}else if(d.type=='INPUT_TYPE_PARAM' || d.type=='INPUT_TYPE_YN' ){
									var param='ACTIVE_FLAG';
									if(d.type=='INPUT_TYPE_PARAM'){
										param=d.object;
									}
									input={
										xtype:'idropdown',
										id:$this.id+'input',
										parameter:param,
										value:d.value,
										fieldLabel:record.data.f1,
										listeners:{
											blur:function(a){
												$this.save($this.level,$this.menu_code,record.data.i,a.getValue(),null,$this.tenant_id,$this.role_id,$this.user_id);
											}
										}
									}
								}else if(d.type=='INPUT_TYPE_OBJECTQ'){
									input={
										xtype:'idropdown',
										id:$this.id+'input',
										parameter:'ACTIVE_FLAG',
										value:d.value,
										query:d.object,
										fieldLabel:record.data.f1,
										listeners:{
											blur:function(a){
												$this.save($this.level,$this.menu_code,record.data.i,a.getValue(),null,$this.tenant_id,$this.role_id,$this.user_id);
											}
										}
									}
								}else if(d.type=='INPUT_TYPE_INTEGER' ){
									input={
										xtype:'inumberfield',
										id:$this.id+'input',
										fieldLabel:record.data.f1,
										app:{decimal:2},
										listeners:{
											blur:function(a){
												$this.save($this.level,$this.menu_code,record.data.i,a._getValue(),null,$this.tenant_id,$this.role_id,$this.user_id);
											}
										}
									}
								}else if(d.type=='INPUT_TYPE_DATE' ){
									input={
										xtype:'idatefield',
										id:$this.id+'input',
										fieldLabel:record.data.f1,
										value:d.value,
										listeners:{
											blur:function(a){
												$this.save($this.level,$this.menu_code,record.data.i,a.val(),null,$this.tenant_id,$this.role_id,$this.user_id);
											}
										}
									}
								}
								var size = {
									width: window.innerWidth || document.body.clientWidth,
									height: window.innerHeight || document.body.clientHeight
								}
								var win=new Ext.Window({
									modal:true,
									maxWidth:size.width,
									maxHeight:size.height,
									width: 400,
									title:'Setting',
									layout:'fit',
									listeners:{
										show:function(){
											shortcut.set({
												code:'setting',
												list:[
													{key:'esc',fn:function(){_click(_var.Setting.id+'btnClose');}}
												]
											});
										},
										close:function(){$this.refresh();shortcut.remove('setting');}
									},
									fbar: [{
										text: 'Close',
										id:$this.id+'btnClose',
										tooltip:'Close <b>[Esc]</b>',
										iconCls:'fa fa-close',
										handler: function(){win.close();}
									}],
									items:[
										{
											xtype:'ipanel',
											
											items:[
												input
											]
										}
									]
								}).show();
								if(d.type=='INPUT_TYPE_INTEGER'){
									Ext.getCmp($this.id+'input')._setValue(d.value);
								}
								Ext.getCmp($this.id+'input').focus();
							}
						},
						failure : function(jqXHR, exception) {
							grid.setLoading(false);
							ajaxError(jqXHR, exception,true);
						}
					});
				}
			},{
				text: 'Default',
				xtype: 'actioncolumn',
				iconCls: 'fa fa-clipboard',
				handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
					Ext.Msg.confirm('Konfirmasi', 'Apakah akan setting ke default?', function(answer) {
						if (answer == "yes") {
							Ext.Ajax.request({
								url : url + 'cmp/settingDefault',
								method : 'POST',
								params : {
									level:$this.level,
									menu_code:$this.menu_code,
									tenant_id:$this.tenant_id,
									role_id:$this.role_id,
									user_id:$this.user_id,
									setting_code:record.data.i,
								},
								before:function(){$this.setLoading(true);},
								success : function(response) {
									$this.setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S'){
										$this.refresh();
										if(_setting[$this.menu_code] != undefined && _setting[$this.menu_code] != null){
											if(_setting[$this.menu_code][record.data.i] != undefined){
												_setting[$this.menu_code][record.data.i]=r.d;
											}
										}
									}
								},
								failure : function(jqXHR, exception) {
									$this.setLoading(false);
									ajaxError(jqXHR, exception,true);
								}
							});
						}
					});
				}
			}
		];
		this.callParent(arguments);
	}
});