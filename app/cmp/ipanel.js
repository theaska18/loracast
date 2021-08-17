//ipanel
Ext.define('IPanel', {
	alias:'widget.ipanel',
	extend : 'Ext.form.Panel',border : false,autoWidth : true,autoHeight : true,anchor:'100%',autoScroll: true,paddingBottom:true,
	autoSize : true,q : {type : 'panel',tmp:{},focusLoad:''},fReq:true,scrollable : true,qLastForm : {},
	initComponent:function(){
		var bodyStyle='';
		if(this.bodyStyle != undefined){bodyStyle=this.bodyStyle;}
		if(this.title != undefined && this.style != undefined){this.border=true;this.style='margin: -1px 0 0 -1px;';}
		if(this.paddingBottom===true){this.bodyStyle+='padding-right: -1px;padding-bottom:5px;';
		}else{this.bodyStyle+='padding-right: -1px;';}
		this.callParent(arguments);
		if(this.init != undefined){this.init();}
	},
	qFinder : function(arr, $this,load) {
		var t=this,valid=false,property=$this.property,type='',bArr=false;
		if(property !== undefined && $this.name !== undefined && $this.name.substring(($this.name.length-7),$this.name.length)!='inputEl'){
			type=property.type;
			if($this.name.substring(($this.name.length-2),$this.name.length)=='[]'){bArr=true;}
		}
		if (type == 'textfield'|| type == 'dropdown' || type == 'hidden' || type == 'checkbox'|| type == 'radio' || type == 'autocomplete'|| type == 'numberfield'|| type == 'select') {
			if(bArr===true){
				if(arr[$this.name]==undefined){arr[$this.name]=[];}
				if(type=='numberfield'){arr[$this.name].push($this._getValue());
				}else{arr[$this.name].push($this.getValue());}
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setValue(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.setReadOnly(true);dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.setReadOnly(true);dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad=='' && type!='hidden'){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]=[];}
					var dataField={};
					dataField[database.field]={};
					var field=dataField[database.field];
					if(type=='numberfield'){field['value']=$this._getValue();}else{field['value']=$this.getValue();}
					if(database.option != undefined){field['option']=database.option;}
					if(database.separator != undefined){field['separator']=database.separator;}
					if(database.type != undefined){field['type']=database.type;}else{if(type == 'checkbox'){field['type']='boolean';}}
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
					if(database.sequence != undefined && database.sequence!==''){field['sequence']=database.sequence;}
					t.q.tmp[database.table].push(dataField);
				}
			}else{
				if(type=='numberfield'){if($this._getValue != undefined){arr[$this.name] = $this._getValue();}
				}else{if($this.getValue != undefined){arr[$this.name] = $this.getValue();}}
				if($this.database != undefined){
					var database=$this.database;
					if(load != undefined){
						var dis=false;
						$this.setValue(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.setReadOnly(true);dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.setReadOnly(true);dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad=='' && type!='hidden'){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]={};}
					t.q.tmp[database.table][database.field]={};
					var field=t.q.tmp[database.table][database.field];
					if(type=='numberfield'){field['value']=$this._getValue();}else{field['value']=$this.getValue();}
					if(database.option != undefined){field['option']=database.option;}
					if(database.separator != undefined){field['separator']=database.separator;}
					if(database.type != undefined){field['type']=database.type;}else{if(type == 'checkbox'){field['type']='boolean';}}
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
					if(database.sequence != undefined && database.sequence!==''){field['sequence']=database.sequence;}
				}
			}
			if($this.readOnly===false){if(t.req==true && $this.validate()==false){valid=true;if(t.fReq==true){t.fReq=false;$this.focus();}}}
		}else if (type == 'htmleditor'){
			if(bArr===true){
				if(arr[$this.name]==undefined){arr[$this.name]=[];}
				arr[$this.name].push($this.getValue());
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setValue(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.disable();dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.disable();dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad==''){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]=[];}
					var dataField={};
					dataField[database.field]={};
					var field=dataField[database.field];
					field['value']=$this.getValue();
					field['type']='html';
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
					if(database.sequence != undefined && database.sequence!==''){field['sequence']=database.sequence;}
					t.q.tmp[database.table].push(dataField);
				}
			}else{
				arr[$this.name] = $this.getValue();
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setValue(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.setReadOnly(true);dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.setReadOnly(true);dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad==''){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]={};}
					t.q.tmp[database.table][database.field]={};
					var field=t.q.tmp[database.table][database.field];
					field['value']=$this.getValue();
					field['type']='html';
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
					if(database.sequence != undefined && database.sequence!==''){field['sequence']=database.sequence;}
				}
			}
		}else if(type == 'datefield'){
			if(bArr===true){
				if(arr[$this.name]==undefined){arr[$this.name]=[];}
				arr[$this.name].push($this.val());
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setValue(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.disable();dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.disable();dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad==''){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]=[];}
					var dataField={};
					dataField[database.field]={};
					var field=dataField[database.field];
					field['value']=$this.val();
					field['type']='datetime';
					if(database.separator != undefined){field['separator']=database.separator;}
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
					if(database.sequence != undefined && database.sequence!==''){field['sequence']=database.sequence;}
					t.q.tmp[database.table].push(dataField);
				}
			}else{
				arr[$this.name] = $this.val();
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setValue(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.disable();dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.disable();dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad==''){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]={};}
					t.q.tmp[database.table][database.field]={};
					var field=t.q.tmp[database.table][database.field];
					field['value']=$this.val();
					field['type']='datetime';
					if(database.separator != undefined){field['separator']=database.separator;}
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
					if(database.sequence != undefined && database.sequence!==''){field['sequence']=database.sequence;}
				}
			}
			if($this.readOnly===false){if(t.req==true && $this.validate()==false){valid=true;if(t.fReq==true){t.fReq=false;$this.focus();}}}
		} else if(type == 'filefield'||type == 'fotoupload'){
			if(bArr===true){
				if(arr[$this.name]==undefined){arr[$this.name]=[];}
				arr[$this.name].push($this.result);
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setFoto(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.disable();dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.disable();dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad==''){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]=[];}
					var dataField={};
					dataField[database.field]={};
					var field=dataField[database.field];
					field['value']=$this.result;
					field['type']='file';
					if(database.type != undefined){field['type']=database.type;}
					if(database.file != undefined){field['file']=database.file;}
					if(database.primary != undefined && database.primary===true){field['primary']=true;};
					if(database.sequence != undefined && database.sequence!==''){field['sequence']=database.sequence;}
					t.q.tmp[database.table].push(dataField);
				}
			}else{
				arr[$this.name] = $this.result;
				if($this.database != undefined){
					var database=$this.database ;
					if(load != undefined){
						var dis=false;
						$this.setFoto(load[database.table][database.field]);
						if(t.database.command[database.table].primary==database.field){$this.disable();dis=true;}
						if(t.database.command[database.table].unique != undefined){
							for(var i=0,iLen=t.database.command[database.table].unique.length;i<iLen;i++){
								if(t.database.command[database.table].unique[i].field==database.field){$this.disable();dis=true;break;}
							}
						}
						if(dis==false && t.q.focusLoad==''){t.q.focusLoad=$this.id;}
					}
					if(t.q.tmp[database.table]== undefined){t.q.tmp[database.table]={};}
					t.q.tmp[database.table][database.field]={};
					var field=t.q.tmp[database.table][database.field];
					field['value']=$this.result;
					field['file']='image';
					field['type']='file';
					if(database.type != undefined){field['type']=database.type;}
					if(database.primary != undefined && database.primary===true){field['primary']=true;}
					if(database.sequence != undefined && database.sequence!==''){field['sequence']=database.sequence;}
				}
			}
		} else if(type == 'tableeditor' && $this.disabled!= true && $this.hidden==false){
			$this.val(arr,t.q.tmp);
			if($this.database != undefined){var database=$this.database ;if(load != undefined){$this.setVal(load[database.table]);}}
			if(t.fReq==true && t.req==true && $this.check()==false){valid=true;t.fReq=false;}
		}else{
			if ($this.items != undefined && $this.disabled!= true && $this.hidden==false) {
				for (var i = 0,iLen=$this.items.length; i <iLen ; i++) {
					var val=null;
					if($this.items.items!= undefined){val=this.qFinder(arr, $this.items.items[i],load);}else{val=this.qFinder(arr, $this.items[i],load);}
					if(val==true &&  t.req==true){valid=true;}
				}
			}
		}
		return valid;
	},
	qSetForm : function() {
		this.req=false;
		var arr = {};
		this.qFinder(arr, this);
		this.qLastForm = arr;
	},
	qGetForm : function(req) {
		var arr = {};
		if(req != undefined && req==true){this.req=true;this.fReq=true;
		}else{this.req=false;}
		var hasil=this.qFinder(arr, this),sama = true;
		var params = arr,last = this.qLastForm,frm=null;
		for ( var i in last) {
			frm=params[i];
			if (Array.isArray(frm) === false && Array.isArray(last[i]) === false) {if (frm != last[i]) {sama = false;break;}
			} else {
				if (frm.length == undefined && last[i].length == undefined) {sama = false;break;
				} else {
					if (frm.length == last[i].length ) {for (var j = 0,jLen=frm.length; j <jLen ; j++) {if (frm[j] != last[i][j]) {sama = false;break;}}} else {sama = false;break;}
				}
			}
		}
		if(sama==false && hasil==true && this.req==true){sama=null;}
		this.req=false;
		return sama;
	},
	qParams : function() {
		var arr = {};
		this.q.tmp={};
		this.qFinder(arr, this);
		return arr;
	},
	_parameter:function(){
		var arr = {};
		this.q.tmp={};
		this.qFinder(arr, this);
		this.q.tmp['_command']={};
		if(this.database!=undefined){if(this.database.command != undefined){this.q.tmp['_command']=this.database.command;}}
		return JSON.stringify(this.q.tmp);
	},
	_save:function(onSuccess,onError){
		var $this=this;
		Ext.Msg.confirm('Konfirmasi','Apakah Akan Menyimpan Data ini ?',function(answer){
			if(answer=='yes'){
				Ext.Ajax.request({
					url : url + 'fn/transaction/saveTransaction',
					method : 'POST',
					params:{data:$this._parameter()} ,
					before:function(){
						$this.setLoading('Menyimpan Data.');
					},
					success : function(response) {
						$this.setLoading(false);
						var r = ajaxSuccess(response);
						if (r.r == 'S') {if(onSuccess!= undefined)onSuccess(r);}
					},
					failure : function(jqXHR, exception) {
						$this.setLoading(false);
						if(onError!= undefined)onError();
						ajaxError(jqXHR, exception,true);
					}
				});
			}
		});
	},
	_load:function(onSuccess,onError,beforeLoad){
		var $this=this;
		Ext.Ajax.request({
			url : url + 'fn/transaction/loadTransaction',
			method : 'POST',
			params:{data:$this._parameter()},
			before:function(){
				$this.setLoading('Mengambil Data.');
			},
			success : function(response) {
				$this.setLoading(false);
				var r = ajaxSuccess(response);
				if (r.r == 'S') {
					$this.qReset();
					var arr = {};
					$this.q.focusLoad='';
					if(beforeLoad!= undefined)beforeLoad(r.d);
					$this.qFinder(arr, $this,r.d);
					$this.qSetForm();
					if(onSuccess!= undefined)onSuccess(r);
					
					if($this.q.focusLoad !=''){Ext.getCmp($this.q.focusLoad).focus();}
				}
			},
			failure : function(jqXHR, exception) {
				$this.setLoading(false);
				if(onError!= undefined && onError!= null)onError();
				ajaxError(jqXHR, exception,true);
			}
		});
	},
	qReset : function() {this.getForm().reset(true);}
});