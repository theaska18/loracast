/*
	import cmp.iselect
	import cmp.idatefield
	import cmp.iinput
	import PARAMETER.iparameter
*/
Ext.define('IEmployee', {
	alias:'widget.iemployee',
	extend : 'ISelect',
	fieldLabel:'Karyawan',
	allowBlank : false,
	valueField:'employee_id',
	textField:'name',
	initComponent:function(){
		var $this=this;
		
		
		this.button={};
		this.button={
			items:[
				{
					xtype:'itextfield',
					fieldLabel:'Nama',
					name:'f2',
					database:{
						table:'app_employee',
						field:'first_name',
						separator:'like'
					},
					id:$this.id+'.f1'
				},{
					xtype:'ihiddenfield',
					name:'f6',
					database:{
						table:'app_employee',
						field:'M.tenant_id',
						type:'double',
						separator:'='
					},
					id:$this.id+'.f2',
					value:_tenant_id
				},{
					xtype:'ihiddenfield',
					name:'f10',
					database:{
						table:'app_employee',
						field:'M.active_flag',
						type:'active',
					},
					value:'Y',
					id:$this.id+'.f3'
				},{
					xtype:'ihiddenfield',
					name:'f9',
					database:{
						table:'app_employee',
						field:'M.employee_id',
						type:'none',
						separator:'not in'
					},
					value:'(\'\')',
					id:$this.id+'.f4'
				},{
					xtype:'itextfield',
					name:'f1',
					fieldLabel:'ID Number',
					database:{
						table:'app_employee',
						field:'id_number',
						separator:'like'
					},
					id:$this.id+'.f5'
				},{
					xtype:'iparameter',
					name : 'f3',
					fieldLabel:'Jenis Kelamin',
					database:{
						table:'app_employee',
						field:'gender'
					},
					parameter:'GENDER',
					id:$this.id+'.f6'
				},{
					xtype:'iinput',
					label :'Tgl. Lahir',
					items : [
						{
							xtype:'idatefield',
							name : 'f4',
							margin:false,
							database:{
								table:'app_employee',
								field:'birth_date',
								separator:'>='
							},
							emptyText: 'Awal',
							id:$this.id+'.f7'
						},{
							xtype:'displayfield',
							value:' &nbsp; - &nbsp; '
						},{
							xtype:'idatefield',
							margin:false,
							database:{
								table:'app_employee',
								field:'M.birth_date',
								separator:'<='
							},
							name : 'f5',
							emptyText:'Akhir',
							id:$this.id+'.f8'
						}
					]
				},{
					xtype:'itextfield',
					name:'f8',
					fieldLabel:'Alamat',
					database:{
						table:'app_employee',
						field:'address',
						separator:'like',
						id:$this.id+'.f9'
					},
					press:{
						enter:function(){
							$this.refresh();
						}
					}
				}
			],
			database:{
				table:'app_employee',
				inner:'INNER JOIN app_parameter_option GENDER ON GENDER.option_code=M.gender'
			},
			columns:[
				{ hidden:true,dataIndex: 'employee_id',database:{field:'employee_id'} },
				{ text: 'No. ID',width: 80, dataIndex: 'id_number' ,align:'center',database:{field:'id_number'} },
				{ text: 'Nama',width: 200,dataIndex: 'name',database:{field:"CONCAT(CASE WHEN first_name IS NULL THEN '' ELSE first_name END,' ',CASE WHEN last_name IS null THEN '' ELSE last_name END) AS name"} },
				{ text: 'Jenis Kelamin',width: 100,align:'center', dataIndex:'gender' ,database:{field:'GENDER.option_name AS gender'} },
				{ text: 'Tanggal Lahir',width: 100,align:'center', dataIndex: 'birth_date' ,database:{field:'birth_date'} },
				{ text: 'Alamat',width: 100,dataIndex: 'address',flex:1,database:{field:'address'}  },
			]
		};
		this.callParent(arguments);
		this.setValue_=this.setValue;
		$this.setValue=function(val){
			// console.log(this.id);
			// console.log(val);
			if(typeof val=='object'){
				this.setValue_(val);
			}else{
				if(val != null && val !=''){
					this.disable();
					Ext.Ajax.request({
						url : url + 'cmd?m=EMPLOYEE&f=getById&a=t&id='+val,
						method : 'GET',
						idCmp:this.id,
						success : function(response,a) {
							Ext.getCmp(a.idCmp).enable();
							var r = ajaxSuccess(response);
							if (r.r == 'S') {
								Ext.getCmp(a.idCmp).setValue_(r.d);
							}
						},
						failure : function(jqXHR, exception) {
							Ext.getCmp(exception.idCmp).enable();
							ajaxError(jqXHR, exception,true);
						}
					});
				}
			}
		};
	}
	
	
})