Ext.SMEStorageSFBaseHTML='<div id="mainTreeSharedFilesBorder" style="width:100%; height:100%; overflow:auto;"><div id="mainTreeSharedFiles" style=""></div><div id="SMEStorageSFModalbox" class="x-hidden"></div></div>';

if(  typeof(SMEStorageSF)!='undefined'  ){
	if(  typeof(SMEStorageSF.contextMenu)!='undefined'  ){
		SMEStorageSF.contextMenu.removeAll();
	}
	if(  typeof(SMEStorageSF.mainTree)!='undefined'  ){
		SMEStorageSF.mainTree=null;
		SMEStorageSF.mainTree=new Array();
	}
}

with(SMEStorageSharedFiles=function(){							//	Constructor
	this.userInfo['token']='*';
	this.userInfo['autologincode']='';
	this.userInfo['userid']='';
	this.userInfo['login']='';
	this.userInfo['password']='';

	if(  navigator.appName=='Opera'  ){
		this.brouser=navigator.appName;
	}
}){
	prototype.tree;
	prototype.treeId="mainTreeSharedFiles";

	prototype.pathToScript='../';
	prototype.pathToIcons=prototype.pathToScript + 'icons/';
	prototype.pathToFileIcons=prototype.pathToScript + 'fileicons/';
	prototype.script_for_resend_request=prototype.pathToScript+'SMEStorageSharedFiles.php?p=';
	
	prototype.server_sme='http://smestorage.com';
	prototype.server_sme_api='http://smestorage.com/api';
	
	prototype.brouser="";
	
	prototype.userInfo=new Array();
	prototype.mainTree=new Array();
	prototype.rqP='';
	prototype.rootNode;
	prototype.contextMenu;
	prototype.showMessageMoveFilesInBackground=1;
	
	prototype.waitResult=0;
	prototype.waitResult2=0;
	prototype.responseData='';
	prototype.timerID='';
	prototype.modalbox="";
	prototype.externalName="";

//------------------------------------------------------------------------------------------
	prototype.searchMainTree=function(){
		if( document.getElementById(this.treeId) ){
			this.initAll();
			this.createFileManagerTree();
		}else{
			setTimeout(this.externalName + ".searchMainTree();", 250);
		}
	}
//------------------------------------------------------------------------------------------
	prototype.initAll=function(){
		this.tree='';
		this.treeId="mainTreeSharedFiles";
		
		this.server_sme='http://smestorage.com';
		this.server_sme_api='http://smestorage.com/api';
		
		this.brouser="";
		
		this.mainTree=new Array();
		this.rqP='';
		this.rootNode='';
		this.contextMenu='';
		this.showMessageMoveFilesInBackground=1;
		
		this.waitResult=0;
		this.waitResult2=0;
		this.responseData='';
		this.timerID=-1;
		this.modalbox="";
		this.userInfo['token']='*';
		this.userInfo['autologincode']='';
		this.userInfo['userid']='';
		
	}
//------------------------------------------------------------------------------------------
	prototype.userTryOpenNode=function(Node){
		var id=Node.id;
		var L=0;
		id=id.replace(this.treeId, '');
		
		if( id==0 ){
			this.clearPanel(this.treeId);
		}

		if( id==0 ){
			this.getGroupsList();
			return 0;
		}

		var i=0;
		if( id!=0 ){
			while(  (typeof(this.mainTree)!='undefined') && (typeof(this.mainTree[i])!='undefined')  ){
				if(  this.mainTree[i]["id"]==id  ){
					if(  this.mainTree[i]['loaded']==1  ){
						return 0;
					}
					break;
				}
				i++;
			}
		}
		
		this.getSharedFilesList(id);
	}
//------------------------------------------------------------------------------------------
	prototype.createFileManagerTree=function(){
		var thisObject=this;
		
		this.rootNode = new Ext.tree.AsyncTreeNode({
			expanded: false,
			text: 'All files',
			id: this.treeId + '0',
			leaf: false,
			children: []
		});

		this.contextMenu = new Ext.menu.Menu({
			items: [
/*
			{
				id: this.treeId + 'Menu' + 'delete',
				text: 'Delete',
				icon: this.pathToScript+'iconContextMenu/delete.gif'
			},
*/		
			{
				id: this.treeId + 'Menu' + 'download',
				text: 'Download',
				icon: this.pathToScript+'iconContextMenu/download.gif'
			},{
				id: this.treeId + 'Menu' + 'edit',
				text: 'Edit',
				icon: this.pathToScript+'iconContextMenu/edit.gif'
			},{
				id: this.treeId + 'Menu' + 'url',
				text: 'URL',
				icon: this.pathToScript+'iconContextMenu/url.gif'
			}
/*
			,{
				id: this.treeId + 'Menu' + 'email',
				text: 'Email',
				icon: this.pathToScript+'iconContextMenu/email.gif'
			}*/
			,{
				id: this.treeId + 'Menu' + 'open',
				text: 'Open',
				icon: this.pathToScript+'iconContextMenu/open.gif'
			}],
			listeners: {
				itemclick: function(item) {
					switch( item.id.replace(thisObject.treeId + 'Menu', '') ) {
						case 'delete':
							thisObject.doDelete(1);
							break;
						case 'download':
							thisObject.mDownload();
							break;
						case 'edit':
							thisObject.Edit();
							break;
						case 'url':
							thisObject.getURL();
							break;
						case 'email':
							thisObject.mEmail();
							break;
						case 'open':
							thisObject.mOpen();
							break;
					}
				}
			}
		});

		this.tree = new Ext.tree.TreePanel({
			renderTo: this.treeId,
			useArrows: false,
			autoScroll: false,
			animate: false,
			enableDD: false,
			containerScroll: true,
			border: false,
			selModel: new Ext.tree.MultiSelectionModel(), 
			containerScroll: true, 
			dropConfig: {appendOnly:false}, 
	
			root: this.rootNode,
			rootVisible: false,	
			listeners:{        
				beforeexpandnode:function(Node){
					thisObject.userTryOpenNode(Node);
				},
				contextmenu: function(node, e) {
						thisObject.synchronizeMenu();
						var c = SMEStorageSF.contextMenu;
						c.showAt(e.getXY());
				},
				beforedblclick: function(Node) {
						var id=Node.id;
						id=id.replace(thisObject.treeId, '');
						var i=0;
						while(  (typeof(thisObject.mainTree)!="undefined") && (typeof(thisObject.mainTree[i])!="undefined")  ){
							if(  (thisObject.mainTree[i]['id']==id)  ){
								if(  thisObject.mainTree[i]['type']==0  ){
									Ext.MessageBox.confirm('Download', 'Do you want to download this file?', function(btn){
										if( btn == 'yes' ){
											thisObject.mDownload(id);
										}
									});
			
									return 0;
								}
								break;
							}
							i++;
						}//while
				}
			}
//			,			contextMenu: this.contextMenu
		});

		Ext.get('mainTreeSharedFiles').on("mousedown", function(e) {
			if(  thisObject.brouser=='Opera'  ){
				if(  e.button==2  ){													// create context menu if right click in Opera
					thisObject.tree.fireEvent('contextmenu', thisObject.rootNode, e);
					return false;
				}
			}
		});

		return 0;
	}

//------------------------------------------------------------------------------------------
	prototype.menuEnable=function(id, enable){			// enable=0 - set disable, enable=1 - set enable
		if(this.contextMenu && this.contextMenu.items) {
			var b=this.treeId + 'Menu';
			this.contextMenu.items.each(function(item){
				if(  item.id.replace(b, '') == id  ){
					if(  enable == 0  ) {
						item.disable();
					}else{
						item.enable();
					}
				}
			});
		}
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.synchronizeMenu=function(){			// enable=0 - set disable, enable=1 - set enable
		this.menuEnable('download', 0);
		this.menuEnable('edit', 0);
		this.menuEnable('url', 0);
		this.menuEnable('open', 0);

		var i=0;
		var selectFolder=0;
		var selectFile=0;
		var selectGroup=0;
		var selectUser=0;
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected())  ){
				if(this.mainTree[i]["type"]==0){
					selectFile++;
				}
				if(this.mainTree[i]["type"]==1){
					selectFolder++;
				}
				if(this.mainTree[i]["type"]==2){
					selectGroup++;
				}
				if(this.mainTree[i]["type"]==3){
					selectUser++;
				}
			}
			i++;
		}


		if(  (selectFolder==0) && (selectFile==0)  ){
		}
		
		if(  (selectGroup==0) && (selectUser==0)  ){
			if(  (selectFolder!=0) && (selectFile!=0)  ){
			}else{
				if(  selectFolder==1  ){
				}
				if(  (selectFile==0) && (selectFolder==1)  ){
				}
				
				if(  selectFile!=0  ){
				}
				if(  (selectFile==1) && (selectFolder==0)  ){
				}
				if(  selectFile==1  ){
					this.menuEnable('download', 1);
					this.menuEnable('url', 1);	
	
					var i=0;					
					while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
						if(  (typeof(this.mainTree[i]['node'])!="undefined") && (this.mainTree[i]['node'].isSelected())  ){
							var type=this.mainTree[i]["type"];
							var ext=this.mainTree[i]["extension"];
							if(   (ext=='doc') || (ext=='xls') || (ext=='txt')
								 || (ext=='php') || (ext=='htm') || (ext=='html')
								 || (ext=='pdf')
							){
								this.menuEnable('edit', 1);
							}
						
							if(   (ext=='doc') || (ext=='pdf')  || (ext=='docx')
								 || (ext=='ppt') || (ext=='pptx') || (ext=='tiff')
							){
								this.menuEnable('open', 1);
							}
							break;
						}
						i++;
					}//while
	
	
				}
			}
		}

		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.addElementToPanel=function(treeId, element, folderId){
		var pNode;
		var leaf;
		var i=0;


		var treeCode = document.getElementById('mainTreeSharedFilesBorder').innerHTML;
		if( treeCode.indexOf(treeId + element['id'])!=-1 ){
			return false;
		}
		
		i=0;
		if( folderId!=0 ){
			while(  (typeof(this.mainTree)!='undefined') && (typeof(this.mainTree[i])!='undefined')  ){
				if(  this.mainTree[i]["id"]==folderId  ){
					pNode = this.mainTree[i]['node'];
					break;
				}
				i++;
			}
		}else{
			pNode=this.rootNode;
		}
			
		if(  typeof(pNode)=='undefined'  ){
			return -1;
		}
	
		
		if(  element['type']==0  ){
			leaf=true;
		}else{
			leaf=false;
		}

		var node='';
		if(  element['type']==0  ){
			node = new Ext.tree.AsyncTreeNode({
				text: element['name'],
				id: treeId + element['id'],
				leaf: leaf,
				icon: this.getIcon(element['extension']),
				children: []
			});
		}
		
		if(  element['type']==1  ){
			node = new Ext.tree.AsyncTreeNode({
				text: element['name'],
				id: treeId + element['id'],
				leaf: leaf,
				children: []
			});
		}
		
		if(  element['type']==2  ){
			node = new Ext.tree.AsyncTreeNode({
				text: element['name'],
				id: treeId + element['id'],
				leaf: leaf,
				icon: this.getIcon('%group'),
				children: []
			});
		}
		
		if(  element['type']==3  ){
			node = new Ext.tree.AsyncTreeNode({
				text: element['name'],
				id: treeId + element['id'],
				leaf: leaf,
				icon: this.getIcon('%group'),
				children: []
			});
		}
		
		pNode.appendChild(node);
		
		return node;
	}
//------------------------------------------------------------------------------------------
	prototype.deleteElementFromPanel=function(treeId, id){
		var i=0;
		if( id!=0 ){
			while(  (typeof(this.mainTree)!='undefined') && (typeof(this.mainTree[i])!='undefined')  ){
				if(  this.mainTree[i]["id"]==id  ){
					this.mainTree[i]['node'].remove();
					this.mainTree[i]=this.mainTree[this.mainTree.length-1];
					this.mainTree.length--;
					break;
				}
				i++;
			}
		}
			
	}
//------------------------------------------------------------------------------------------
	prototype.clearPanel=function(treeId){
		var i=0;
		while(  (typeof(this.mainTree)!='undefined') && (typeof(this.mainTree[i])!='undefined')  ){
			this.mainTree[i]['node'].remove();
			i++;
		}
		
		this.mainTree=new Array();
		
	}
//------------------------------------------------------------------------------------------
	prototype.sortFolder=function(nFiles, type){				// type=0 - files, type=1 - folders, type=2 - groups, type=0 - users
		var i=0;
		var L=0;
		while(  (i<nFiles.length) && (L==0)  ){													// Sort folder
			var j=1;
			L=1;
			while(  j<nFiles.length  ){
				if(  (nFiles[j]['type']!=type) || (nFiles[j-1]['type']!=type)  ){
					j++;
					continue;
				}
	
				var k=0;
				while(  (k<nFiles[j]['name'].length) && (k<nFiles[j-1]['name'].length)
								&& (nFiles[j]['name'].charAt(k) ==  nFiles[j-1]['name'].charAt(k))  ){
					k++;
				}
	
				if(  nFiles[j]['name'].charAt(k)<nFiles[j-1]['name'].charAt(k)  ){
					var xx=nFiles[j];
					nFiles[j]=nFiles[j-1];
					nFiles[j-1]=xx;
					L=0;
				}
				j++;
			}
			i++;
		}
		return nFiles;
	}
	//==========================================================================================
	prototype.signIn=function(mask){
	
		if(  (typeof(this.userInfo['login'])=='undefined') || (typeof(this.userInfo['password'])=='undefined')  ){
			Ext.Msg.alert('Error', 'Login or password not found.');
			
			if(  (typeof(timerID)!='undefined') && (timerID>0)  ){
				clearInterval(timerID);
				timerID='';
			}
			return -2;
		}
		
		var msg='';
		if(  (typeof(mask)!='undefined') && (mask==1)  ){
			msg='Get token<br><br>Please wait...';
		}

		var p=[];
		p[0]=this.userInfo['login'];
		p[1]=this.userInfo['password'];
		
//		this.userInfo['token']= '*';
		this.runFunction('gettoken', p, msg, 'signInResp()');
	}
//------------------------------------------------------------------------------------------
	prototype.signInResp=function(){
		this.waitResult=0;
		res=this.responseData;
		if(  typeof(res['token'])=="undefined"  ){
			Ext.Msg.alert('Error', 'Unable to retrieve access token. Please check your username and password are correct and retry.');
			if(  this.timerID>0  ){
				clearInterval(this.timerID);
				this.timerID='';
			}
			return 0;
		}
		
		this.userInfo['token']					= res['token'];
		this.userInfo['autologincode']	= res['autologincode'];
		this.userInfo['userid']					= res['userid'];
	}
//------------------------------------------------------------------------------------------
	prototype.doDelete=function(showConfirm){
		if(  (typeof(showConfirm)!="undefined") && (showConfirm==1)  ){
			var i=0;
			var L=0;
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected())  ){
					L=1;
					break;
				}
				i++;
			}

			if(  L==0  ){
				Ext.Msg.alert('Error', 'Choose file(s) or folder(s), what you want to delete');
				return -2;
			}

			var thisObject=this;
			Ext.MessageBox.confirm('Delete', 'Do you want to delete?', function(btn){
				if (btn == 'yes') {
					thisObject.doDelete();
				}
			});
			
			return 0;
		}
		
		var f='';
		var mess='';
		
		var L=0;
		var i=0;
		var id='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){			// Get id selected files
			if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]["type"]==0)  ){
				if( L==0 ){
					id = this.mainTree[i]["real_id"];
					L++;
				}else{
					id += ',' + this.mainTree[i]["real_id"];
				}
			}
			i++;
		}
		
		if( id.length<1 ){										// files are not selected
			var i=0;
			var id='';
			var name='';
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){			// Get id selected folder
				if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]["type"]==1)  ){
					id = this.mainTree[i]["real_id"];
					name = this.mainTree[i]["name"];
					break;
				}
				i++;
			}
			
			f = 'doDeleteFolder';
			mess='Delete &nbsp; '+ name;
		}else{
			f = 'doDeleteFile';
			mess='Delete selected file(s)';
		}

		if( id.length<1 ){										// folders are not selected
			return 0;
		}
		
		var p=[];
		p[0]=id;
	
		this.runFunction(f, p, mess + '<br><br>Please wait...', 'doDeleteResp();');
	}
//------------------------------------------------------------------------------------------
	prototype.doDeleteResp=function(){
		var L=0;
		var i=0;
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){			// delete selected files
			if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]["type"]==0)  ){
				this.deleteElementFromPanel(this.treeId, this.mainTree[i]["id"]);
				L=1;
				continue;
			}
			i++;
		}
		
		if( L==0 ){										// files are not deleted
			var i=0;
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){			// deleted selected folder
				if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]["type"]==1)  ){
					this.deleteElementFromPanel(this.treeId, this.mainTree[i]["id"]);
					L=2;
					break;
				}
				i++;
			}
			
		}

		if( L!=0 ){										// not all folders are removed
			this.doDelete();
			return 0;
		}

//		var mess=(setValue==1)?('Do Favourite'):('Do Un Favourite');
	}
//------------------------------------------------------------------------------------------
	prototype.mModify=function(){
		var i=0;
		var L=0;
		var c=0;
		var folder='';
		var name='';
		var description='';
		var tags='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected())  ){
				folder=this.mainTree[i]['type'];
				name=this.mainTree[i]['name'];
				description=this.mainTree[i]['description'];
				tags=this.mainTree[i]['tags'];
				c++;
			}
			i++;
		}

		if(  c==0  ){
			Ext.Msg.alert('Error', 'Choose file or folder, what you want to modify');
			return -2;
		}
		
		if(  c>1  ){
			Ext.Msg.alert('Error', 'Choose only one file or folder');
			return -2;
		}
		
		
		var html='';	
		var handler;
		var caption='Modify ';
		if(  folder==1  ){
			handler = function(){
				SMEStorageSF.ModifyFolder();
				SMEStorageSF.modalbox.hide();
			}
			
			caption+='folder';
		}else{
			handler = function(){
				SMEStorageSF.ModifyFile();
				SMEStorageSF.modalbox.hide();
			}

			caption+='file';
		}

		handler = function(){
			if( SMEStorageSF.doModify() != -1 ){
				SMEStorageSF.modalbox.hide();
			}
		}

		var html_header = '<div class="x-window-header">'+ caption +'</div>';
		
		html+= '<table border="0" cellpadding="3" cellspacing="7" align="center" class="SMEStorageSFModalbox">';
		html+= '	<tr>';
		html+= '		<td>Name: </td>';
		html+= '		<td><input type="text" value="'+ name +'" id="ModifyFile_fileName" size="40" class="SMEStorageSFModalbox"></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td>Description: &nbsp;</td>';
		html+= '		<td><input type="text" value="'+ description +'" id="ModifyFile_description" size="40" class="SMEStorageSFModalbox"></td>';
		html+= '	</tr>';
		
		if(  folder==0  ){
			html+= '	<tr>';
			html+= '		<td>Tags: &nbsp;</td>';
			html+= '		<td><input type="text" value="'+ tags +'" id="ModifyFile_tags" size="40" class="SMEStorageSFModalbox"></td>';
			html+= '	</tr>';
		}
		
		html+= '</table>';
		
		document.getElementById('SMEStorageSFModalbox').innerHTML = html_header;
		
		var win = new Ext.Window({
			applyTo:'SMEStorageSFModalbox',
			layout:'fit',
			width:350,
			height:175,
			closeAction:'hide',
			plain: true,
			modal: true,
			
			items: [{
				html: html
			}],
		
			buttons: [{
				text:'Modify',
				handler: handler
			},{
				text: 'Cancel',
				handler: function(){
					SMEStorageSF.modalbox.hide();
				}
			}]
		});

		win.show(this);

		this.modalbox=win;
	}
//------------------------------------------------------------------------------------------
	prototype.doModify=function(id, name, description, tags, folder){
		var i=0;
		var L=0;
		
		if(  (typeof(id)=="undefined") || (id.length<1)  ){
			folder='';
			id='';
			name='';
			description='';
			tags='';
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected())  ){
					folder=this.mainTree[i]['type'];
					id=this.mainTree[i]['real_id'];
					break;
				}
				i++;
			}
				
			name				= document.getElementById('ModifyFile_fileName').value;
			description	= document.getElementById('ModifyFile_description').value;
			if( folder==0 ){
				tags			= document.getElementById('ModifyFile_tags').value;
			}
			if(  name.length<1  ){
				Ext.Msg.alert('Error', 'Enter name');
				return -1;
			}
		}

		var f='';
		var p=[];
		var mess='';
		
		if( folder==1 ){
			f='doRenameFolder';
			p[0]=id;
			p[1]=name;
			p[2]=description;
			mess='folder';
		}else{
			f='doRenameFile';
			p[0]=id;
			p[1]=name;
			p[2]=description;
			p[3]=tags;
			mess='file';
		}

		this.runFunction(f, p, 'Modify '+ mess + '<br><br>Please wait...', 'doModifyResp("'+ id +'", "'+ name +'", "'+ description +'", "'+ tags +'");');
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.doModifyResp=function(id, name, description, tags){
		var i=0;
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected())  ){
				this.mainTree[i]["node"].setText(name);
				this.mainTree[i]["name"] = name;
				this.mainTree[i]["description"] = description;
				if(this.mainTree[i]["type"]==0){
					this.mainTree[i]["tags"] = tags;
				}
				break;
			}
			i++;
		}
		
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.mDownload=function(id){
		var i=0;
		var L=0;
		var c=0;
		var folder='';
		var name='';
		var encrypted='';
		var maincode='';
		var extension='';
		if(  (typeof(id)!="undefined") && (id.length>0)  ){
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['id']==id)  ){
					id					=this.mainTree[i]['real_id'];
					folder			=this.mainTree[i]['type'];
					name				=this.mainTree[i]['name'];
					encrypted		=this.mainTree[i]['encrypted'];
					maincode		=this.mainTree[i]['maincode'];
					extension		=this.mainTree[i]['extension'];
					c++;
				}
				i++;
			}
		}else{
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected())  ){
					id					=this.mainTree[i]['real_id'];
					folder			=this.mainTree[i]['type'];
					name				=this.mainTree[i]['name'];
					encrypted		=this.mainTree[i]['encrypted'];
					maincode		=this.mainTree[i]['maincode'];
					extension		=this.mainTree[i]['extension'];
					c++;
				}
				i++;
			}
		}
		if(  c==0  ){
			Ext.Msg.alert('Error', 'Choose file, what you want to download');
			return -2;
		}
		
		if(  c>1  ){
			Ext.Msg.alert('Error', 'Choose only one file');
			return -2;
		}
		
		if(  folder==1  ){
			Ext.Msg.alert('Error', ' &nbsp; &nbsp; Choose <b>file</b> &nbsp; &nbsp; ');
			return -3;
		}

		if(  encrypted==0  ){
			var furl=this.server_sme + '/files/' + maincode + '.' + extension;
			window.open(furl);
			return 0;
		}
		
		// File is encrypted. Show modalbox for, to take a password

		var html='';	
		var handler;
		var caption='Download encrypted file';

		handler = function(){
			SMEStorageSF.doDownload();
		}

		var html_header = '<div class="x-window-header">'+ caption +'</div>';

		html+= '<table border="0" cellpadding="3" cellspacing="7" align="center" class="SMEStorageSFModalbox">';
		html+= '	<tr>';
		html+= '		<td>Name: </td>';
		html+= '		<td><input type="text" value="'+ name +'" size="30" class="SMEStorageSFModalbox" disabled></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td>Encryption phrase: &nbsp;</td>';
		html+= '		<td><input type="text" value="" id="DownloadEncrypted_phrase" size="30" class="SMEStorageSFModalbox"></td>';
		html+= '	</tr>';
		html+= '</table>';
		
		document.getElementById('SMEStorageSFModalbox').innerHTML = html_header;
		
		var win = new Ext.Window({
			applyTo:'SMEStorageSFModalbox',
			layout:'fit',
			width:350,
			height:150,
			closeAction:'hide',
			plain: true,
			modal: true,
			
			items: [{
				html: html
			}],
		
			buttons: [{
				text:'Download',
				handler: handler
			},{
				text: 'Cancel',
				handler: function(){
					SMEStorageSF.modalbox.hide();
				}
			}]
		});

		win.show(this);

		this.modalbox=win;
	}
//------------------------------------------------------------------------------------------
	prototype.doDownload=function(id, pass){
		var i=0;
		var L=0;
		
		if(  (typeof(id)=="undefined") || (id.length<1)  ){
			id='';
			pass='';
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected())  ){
					id=this.mainTree[i]['real_id'];
					break;
				}
				i++;
			}
			
			pass = document.getElementById('DownloadEncrypted_phrase').value;
			if(  pass.length<1  ){
				Ext.Msg.alert('Error', 'Enter encryption phrase');
				return -1;
			}
		}

		var p=[];
		p[0]=id;
		p[1]=pass;

		this.modalbox.hide();

		this.runFunction('doCheckEncryptionPhrase', p, 'Do check encryption phrase<br><br>Please wait...', 'doDownloadResp("'+ id +'", "'+ pass +'");');
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.doDownloadResp=function(id, pass){
		res=this.responseData;

		if(  (typeof(res['checkresult'])=="undefined") || (res['checkresult']!=0) || (res['checkresult']=='')  ){
			SMEStorageSF.modalbox.show(this);
			Ext.Msg.alert('Error', 'Not correct encryption phrase');
			return -1;
		}

		var p=[];
		p[0]=this.encode64(''+id);
		p[1]=this.encode64(''+pass);
		
		var furl=this.server_sme +'/api/'+ 	this.userInfo['token'] + '/getFile/' + p[0] + ',' + p[1];
		window.open(furl);
		
		this.modalbox.hide();

		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.Edit=function(){
		var i=0;
		var c=0;
		var folder='';
		var id='';
		var maincode='';
		var extension='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected())  ){
				id					=this.mainTree[i]['real_id'];
				folder			=this.mainTree[i]['type'];
				maincode		=this.mainTree[i]['maincode'];
				extension		=this.mainTree[i]['extension'];
				c++;
			}
			i++;
		}

		if(  c==0  ){
			Ext.Msg.alert('Error', 'Choose file, what you want to edit');
			return -2;
		}
		
		if(  c>1  ){
			Ext.Msg.alert('Error', 'Choose only one file');
			return -2;
		}
		
		if(  folder==1  ){
			Ext.Msg.alert('Error', ' &nbsp; &nbsp; Choose <b>file</b> &nbsp; &nbsp; ');
			return -3;
		}

		var L=0;
		var url;
		if(  (extension=='doc') || (extension=='xls') ){
			url= this.server_sme + "/index.php?p=zoho&action=opendocument&id="+ id +"&autologin=" + this.userInfo['autologincode'];
			L=1;
		}
		
		if(  (extension=='txt') || (extension=='php') || (extension=='htm') || (extension=='html')  ){
			url= this.server_sme + "/index.php?p=wysiwyg&fi_id="+ id +"&type=empty2&editor=editarea&autologin=" + this.userInfo['autologincode'];
			L=1;
		}
	
		if(  (extension=='pdf')  ){
			url= this.server_sme + "/?p=scribdviewer&type=main_lite#" + this.server_sme +'/files/'+ maincode +'.'+ extension;
			L=1;
		}
	
		if(  L==1 ){
			window.open(url);
		}
		
	}
//------------------------------------------------------------------------------------------
	prototype.getURL=function(){
		var i=0;
		var id='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]['type']==0)  ){
				id=this.mainTree[i]['real_id'];
				break;
			}
			i++;
		}
			
		if(  id.length<1  ){
			Ext.Msg.alert('Error', 'Choose <b>file</b>');
			return -1;
		}

		var p=[];
		p[0]=id;

		this.runFunction('getFileTinyURL', p, 'Get URL <br><br>Please wait...', 'getURLResp();');
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.getURLResp=function(){
		var i=0;
		var name='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected())  ){
				name=this.mainTree[i]['name'];
				break;
			}
			i++;
		}

		var res=this.responseData;
		if(  (typeof(res['url'])=="undefined") || (typeof(res['tinyurl'])=="undefined")  ){
			Ext.Msg.alert('Error', 'URL not get');
			return -1;
		}
		
		var url =res['url'];
		var turl=res['tinyurl'];

		var html='';	
		var caption='Get URL';
		var html_header = '<div class="x-window-header">'+ caption +'</div>';
		
		html+= '<table border="0" cellpadding="3" cellspacing="7" align="center" class="SMEStorageSFModalbox">';
		html+= '	<tr>';
		html+= '		<td>Name: </td>';
		html+= '		<td><input type="text" value="'+ name +'" size="50" class="SMEStorageSFModalbox" disabled></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td>URL: &nbsp;</td>';
		html+= '		<td><input type="text" value="'+ url +'" size="50" class="SMEStorageSFModalbox"></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td>Short URL: &nbsp;</td>';
		html+= '		<td><input type="text" value="'+ turl +'" size="50" class="SMEStorageSFModalbox"></td>';
		html+= '	</tr>';
		html+= '</table>';
		
		document.getElementById('SMEStorageSFModalbox').innerHTML = html_header;
		
		var win = new Ext.Window({
			applyTo:'SMEStorageSFModalbox',
			layout:'fit',
			width:400,
			height:175,
			closeAction:'hide',
			plain: true,
			modal: true,
			
			items: [{
				html: html
			}],
		
			buttons: [{
				text:'OK',
				handler: function(){
					SMEStorageSF.modalbox.hide();
				}
			},{
				text: 'Cancel',
				handler: function(){
					SMEStorageSF.modalbox.hide();
				}
			}]
		});

		win.show(this);

		this.modalbox=win;
	}
//------------------------------------------------------------------------------------------
	prototype.getGroupsList=function(){
		var p=[];
		p[0]='';

		this.runFunction('getGroupsList', p, 'Get group list <br><br>Please wait...', 'getGroupsListResp();');
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.getGroupsListResp=function(){
		var res=this.responseData;
		
		this.mainTree=new Array();
		
		var i=0;
		var grouplist=res.grouplist;
		while(  (typeof(grouplist)!='undefined') && (typeof(grouplist['n'+i])!='undefined')  ){
			var nGroup=grouplist['n'+i];
	
			if(  nGroup['fi_pid']==''){
				nGroup['fi_pid']='0';
			}
	
			nGroup['id']					=(nGroup['gr_id']=='')?(0):(nGroup['gr_id']);
			nGroup['real_id']				=nGroup['id'];
			nGroup['pid']					=0;
			nGroup['real_pid']			=nGroup['pid'];
			nGroup['type']				=2;																					// 2 - group
			nGroup['name']				=(nGroup['gr_title']=='')?(''):(nGroup['gr_title']);
			nGroup['description']		=(nGroup['gr_description']=='')?(''):(nGroup['gr_description']);
			nGroup['permissions']		=(nGroup['gr_permissions']=='')?(0):(nGroup['gr_permissions']);
			nGroup['private']				=(nGroup['gr_private']=='')?(''):(nGroup['gr_private']);
			nGroup['creator']			=(nGroup['gr_creator']=='')?(0):(nGroup['gr_creator']);
			nGroup['loaded']				=0;								// 1 - folder is loaded

			var users=nGroup['gr_users'];															// Add users
			var j0=0;
			while(  (typeof(users)!='undefined') && (typeof(users['n'+j0])!='undefined')  ){
				var nUser=users['n'+j0];
				nUser['id']						=(nUser['us_id']=='')?(0):(nUser['us_id']);
				nUser['real_id']			=nUser['id'];
				nUser['pid']					=nGroup['id'];
				nUser['real_pid']			=nGroup['real_pid'];
				nUser['type']					=3;																					// 3 - user
				nUser['name']					=(nUser['us_name']=='')?(''):(nUser['us_name']);
				nUser['permissions']	=(nUser['us_permissions']=='')?(0):(nUser['us_permissions']);
				nUser['loaded']				=0;								// 1 - folder is loaded
				
				nUser['id'] = nGroup['id'] +'_'+ nUser['id'];
	
				this.mainTree[this.mainTree.length]=nUser;
				j0++;
			}
			
			nGroup['gr_users']='';
			this.mainTree[this.mainTree.length]=nGroup;
			i++;
		}
		
		this.showGroups();

		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.showGroups=function(){
		var i=0;
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){							// show groups
			if(  this.mainTree[i]['type']==2  ){
				this.mainTree[i]['node'] = this.addElementToPanel(this.treeId, this.mainTree[i], this.mainTree[i]["pid"]);
/*
				var icon = this.getIcon('%group');
				this.mainTree[i]['node'] = new Ext.tree.AsyncTreeNode({
					text: this.mainTree[i]['name'],
					id: 'ShareFolder_mainTree' + this.mainTree[i]['id'],
					leaf: false,
					expanded: false,
					draggable: false,
					allowDomMove: false,
					icon: icon,
					children: []
				});
*/
				this.rootNode.appendChild(this.mainTree[i]['node']);
			}
			i++;
		}
/*
		i=0;
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){							// show users
			if(  (this.mainTree[i]['type']==3)  ){
				//  && (this.mainTree[i]["real_id"]!=this.userInfo['userid'])
				var icon = this.getIcon('%user');
				this.mainTree[i]['node'] = new Ext.tree.AsyncTreeNode({
					text: this.mainTree[i]['name'],
					id: 'ShareFolder_mainTree' + this.mainTree[i]['id'],
					draggable: false,
					icon: icon,
					leaf: true,
					children: []
				});
				
				var pNode='';
				j=0;
				while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[j])!="undefined")  ){
					if(  this.mainTree[j]['id']==this.mainTree[i]['pid']  ){
						pNode=this.mainTree[j]['node'];
						break;
					}
					j++;
				}

				pNode.appendChild(this.mainTree[i]['node']);
			}
			i++;
		}
*/
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.getSharedFilesList=function(id){
		var groupId='';
		var userId='';
		var dirId='';
		var elId='';
		var fid=id + '_';
		var tid=new Array();
		var i=0;
		while(  fid.indexOf('_')>-1  ){
			tid[i]=fid.substring(0, fid.indexOf('_') );
			fid=fid.substring(fid.indexOf('_')+1);
			i++;
		}
	
		if(  typeof(tid)=="undefined"  ){
			return -3;
		}
	
		if(  typeof(tid[0])!="undefined"  ){
			groupId=tid[0];
		}
		
		if(  typeof(tid[1])!="undefined"  ){
			i=0;
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if( this.mainTree[i]["real_id"]==tid[1] ){
					if( this.mainTree[i]["type"]==3 ){
						userId=tid[1];
						break;
					}
				}
				i++;
			}
			
			if( userId=='' ){
				dirId=tid[1];
			}else{
				if( typeof(tid[2])!="undefined" ){
					dirId=tid[2];
				}
			}
		
		}
		if(  (dirId.length>0) && (dirId != tid[tid.length-1]) ){
			elId=tid[tid.length-1];
		}
		
		var i=0;
		var c=0;
		var type='';
		var real_id='';
		while(  i<this.mainTree.length  ){
			if(  (this.mainTree[i]['id']==id)  ){
				type		= this.mainTree[i]['type'];
				real_id	= this.mainTree[i]['real_id'];
				break;
			}
			i++;
		}
		
		i=0;
		while(  i<this.mainTree.length  ){														// Show the elements got before
			if(  (this.mainTree[i]['pid']==id)  ){
				this.mainTree[i]['node'] = this.addElementToPanel(this.treeId, this.mainTree[i], this.mainTree[i]["pid"]);
				if( this.mainTree[i]['node']==false ){
					this.mainTree[i]['id']='';
					this.mainTree[i]['pid']='';
					this.mainTree[i]['us_id']='';
					this.mainTree[i]['real_id']='';
					this.mainTree[i]['real_pid']='';
					this.mainTree[i]['name']='';
					this.mainTree[i]['description']='';
					this.mainTree[i]['type']='';
					this.mainTree[i]['loaded']='';
				}
				if(  (this.mainTree[i]['type']==0) || (this.mainTree[i]['type']==1)  ){
					c++;
				}
			}

			i++;
		}
		if(  !( (type==3) && (real_id!=this.userInfo['userid']) )  ){
			if( c>0 ){
				return 0;
			}
			
			if( type==1 ){
				return 0;
			}
			
			if(  (type==3) && (real_id==this.userInfo['userid'])  ){
				return 0;
			}
	
		}
		
		this.getSharedByGroup(groupId, userId, dirId, elId);
		
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.getSharedByGroup=function(groupId, userId, dirId, elId){

		var p=[];
		p[0]=groupId;
		p[1]=userId;
		p[2]=dirId;
		p[3]=elId;
				
		this.runFunction('getSharedByGroup', p, 'Get list of share files<br><br>Please wait...', 'getSharedByGroupResp("'+ groupId +'","'+ userId +'","'+ dirId +'","'+ elId +'");');

		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.getSharedByGroupResp=function(groupId, userId, dirId, elId){
		res=this.responseData;

		var pid;
		if(  groupId.length>0  ){
			pid=groupId;
			if(  userId.length>0  ){
				pid += '_' + userId;
				if(  dirId.length>0  ){
					pid += '_' + dirId;
					if(  elId.length>0  ){
						pid += '_' + elId;
					}
				}
			}
		}else{
			pid=0;
		}

		var k=0;
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[k])!="undefined")  ){
			if(  (this.mainTree[k]["id"]==groupId) && (this.mainTree[k]["type"]==2)  ){
				this.mainTree[k]["loaded"]=1;
			}
			if(  (this.mainTree[k]["real_id"]==userId) && (this.mainTree[k]["type"]==3)  ){
				this.mainTree[k]["loaded"]=1;
			}
			k++;
		}


		var nFiles=this.getTreeByLevels(res['files']);

		var i=0;
		while(  (typeof(nFiles)!="undefined") && (typeof(nFiles[i])!="undefined")  ){
			var j=i+1;
			var L=0;
			while(  (typeof(nFiles)!="undefined") && (typeof(nFiles[j])!="undefined")  ){
				if(  (nFiles[j]["id"]==nFiles[i]['id']) && (nFiles[j]["pid"]==nFiles[i]['pid']) && (nFiles[j]["sharedid"]==nFiles[i]['sharedid'])  ){
					nFiles[j]["id"]='del';
				}
				j++;
			}
			i++;
		}

		var j=0;
		var tmpArr=new Array();
		var L=0;
		while(  (typeof(nFiles)!="undefined") && (typeof(nFiles[j])!="undefined")  ){
			if(  (nFiles[j]["id"]!='del')  ){
				tmpArr[tmpArr.length]=nFiles[j];
			}
			j++;
		}

		nFiles=tmpArr;

		var j=0;
		var k=0;
		var L=0;
		var L2=1;
		var L04=1;
		while(  L04==1  ){
			var L2=0;
			i=0;
			while(  i<nFiles.length  ){														// Show folders
				if( (nFiles[i]['type']==1) && (nFiles[i]['show']==0) && (nFiles[i]['pid']==pid) ){
					k=0;
					L=0;
					while(  k<this.mainTree.length  ){								// Is already added ?
						if(  (this.mainTree[k]["id"]==nFiles[i]['id']) && (this.mainTree[k]["pid"]==nFiles[i]['pid']) && (this.mainTree[k]["sharedid"]==nFiles[i]['sharedid'])  ){
							L=1;
						}
						k++;
					}
					
					if( L==1 ){
						i++;
						continue;
					}
					
					k=0;
					var L3=1;
					while(  k<this.mainTree.length  ){								// Is show parent element or not ?
						if(  (this.mainTree[k]["id"]==nFiles[i]['pid']) ){
							if(  (typeof(this.mainTree[k]['show'])!="undefined") && (this.mainTree[k]['show']==0) ){
								L2=1;
							}
							L3=0;
							break;
						}
						k++;
					}

					if(  (L2==1) || (L3==1)  ){
						i++;
						continue;
					}
					
					if( L==0 ){
						nFiles[i]['show']=1;
						this.mainTree[this.mainTree.length]=nFiles[i];
						this.mainTree[this.mainTree.length-1]['node'] = this.addElementToPanel(this.treeId, nFiles[i], nFiles[i]["pid"]);
						nFiles[i]['show'] = 1;
					}
				}
	
				i++;
			}




			L04++;		
			if( L04>5 ){
				L04=0;
			}

/*			
			L04=0;
			var i04=0;
			while(  i04<nFiles.length  ){
				if( (nFiles[i04]['type']==1) && (nFiles[i04]['show']==0) ){
					L04=1;
					break;
				}
				i04++;
			}
*/
			j++;
		}

		var k=0;
		var L=0;
		var i=0;
		while(  i<nFiles.length  ){														// Show files
			if(  (nFiles[i]['type']==0) && (nFiles[i]['pid']==pid)  ){
				k=0;
				L=0;
				while(  k<this.mainTree.length  ){
					if(  (this.mainTree[k]["id"]==nFiles[i]['id']) && (this.mainTree[k]["pid"]==nFiles[i]['pid']) && (this.mainTree[k]["sharedid"]==nFiles[i]['sharedid'])  ){
						L=1;
					}
					k++;
				}
				
				if( L==0 ){
					this.mainTree[this.mainTree.length]=nFiles[i];
					this.mainTree[this.mainTree.length-1]['node'] = this.addElementToPanel(this.treeId, nFiles[i], nFiles[i]["pid"]);
					nFiles[i]['show'] = 1;
				}
			}

			i++;
		}
		
		i=0;
		while(  i<nFiles.length  ){														// Save other files
			if(  (nFiles[i]['show']==0)  ){
				var Lk=1;
/*
// (typeof(nFile['us_id'])!='undefined') && 
				if(  (userId.length>0) && (nFiles[i]['id'].indexOf(groupId +'_'+ userId +'_')==-1)  ){
					Lk=0;
				}
*/
/*				
				if(  (userId.length==0) && (typeof(nFiles[i]['us_id'])!='undefined') && (nFiles[i]['us_id']!=this.userInfo['userid'])  ){
					Lk=0;
				}
*/
/*
				if(  (typeof(nFiles[i]['us_id'])!='undefined') && (nFiles[i]['us_id']==this.userInfo['userid'])  ){
					Lk=1;
				}
*/

				if(  Lk==1  ){
					this.mainTree[this.mainTree.length]=nFiles[i];
				}
			}

			i++;
		}
/*
		var j=0;
		var tmpArr=new Array();
		var L=0;
		while(  (typeof(nFiles)!="undefined") && (typeof(nFiles[j])!="undefined")  ){
			if(  (nFiles[j]["id"]!='del')  ){
				tmpArr[tmpArr.length]=nFiles[j];
			}
			j++;
		}

		nFiles=tmpArr;

		var i=0;
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			var j=i+1;
			var L=0;
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[j])!="undefined")  ){
				if(  (this.mainTree[j]["id"]==this.mainTree[i]['id']) && (this.mainTree[j]["pid"]==this.mainTree[i]['pid']) && (this.mainTree[j]["sharedid"]==this.mainTree[i]['sharedid'])  ){
					this.mainTree[j]["id"]='del';
				}
				j++;
			}
			i++;
		}
*/

		return -2;
	}
//------------------------------------------------------------------------------------------
	prototype.getTreeByLevels=function(filelist, mFolderId, shareId, sharer, us_id){
		var nFiles=new Array();
		if(  typeof(sharer)=='undefined'  ){
			sharer='';
		}
	
		var i=0;
		while(  (typeof(filelist)!='undefined') && (typeof(filelist['n'+i])!='undefined')  ){
			var nFile=filelist['n'+i];
			var folderId=mFolderId;
	
			if(  (typeof(folderId)=='undefined') || (folderId.length<1)  ){
				if(  typeof(nFile['gr_id'])!='undefined'  ){
					folderId=nFile['gr_id'];
					if(  (typeof(nFile['us_id'])!='undefined') && (nFile['us_id']!=0)  ){
						folderId+='_'+nFile['us_id'];
						us_id=nFile['us_id'];
					}
				}
			}
	/*
			if(  folderId.indexOf(nFile['pid'])==-1  ){
				folderId += nFile['pid'];
			}
	*/
	
			if(  typeof(nFile['sharer'])!='undefined'  ){
				sharer=nFile['sharer'];
			}else{
				nFile['sharer']=sharer;
			}
			
			if(  typeof(nFile['fi_description'])=='undefined'		){			nFile['fi_description']='';		}
			if(  typeof(nFile['fi_tags'])=='undefined'					){			nFile['fi_tags']='';					}
			
			nFile['id']						=(nFile['fi_id']=='')?(0):(nFile['fi_id']);
			nFile['real_id']			=nFile['id'];
	//		nFile['pid']					=folderId;
			nFile['pid']					=(nFile['fi_pid']=='0')?(''):(nFile['fi_pid']);
			nFile['real_pid']			=nFile['pid'];
			nFile['name']					=(nFile['fi_name']=='')?(''):(nFile['fi_name']);
			nFile['description']	=(nFile['fi_description'].search('HASH')==0)?(''):(nFile['fi_description']);
			nFile['type']					=(nFile['fi_type']=='')?(0):(nFile['fi_type']);						// 0 - file, 1 - folder
			nFile['created']			=(nFile['fi_created']=='')?('0000:00:00 00:00:00'):(nFile['fi_created']);
			nFile['size']					=(nFile['fi_size']=='')?(0):(nFile['fi_size']);
			nFile['tags']					=(nFile['fi_tags'].search('HASH')==0)?(''):(nFile['fi_tags']);
			nFile['public']				=(nFile['fi_public']=='')?(0):(nFile['fi_public']);
			nFile['encrypted']		=(nFile['fi_encrypted']=='')?(0):(nFile['fi_encrypted']);
			nFile['favorite']			=(nFile['fi_favorite']=='')?(0):(nFile['fi_favorite']);
			nFile['modified']			=(nFile['fi_modified']=='')?('0000:00:00 00:00:00'):(nFile['fi_modified']);
			nFile['lastaccessed']	=(nFile['fi_lastaccessed']=='')?('0000:00:00 00:00:00'):(nFile['fi_lastaccessed']);
			nFile['hits']					=(nFile['fi_hits']=='')?(0):(nFile['fi_hits']);
			nFile['expired']			=(nFile['gr_expired']=='')?(0):(nFile['gr_expired']);
			nFile['provider']			=(nFile['fi_provider']=='')?(0):(nFile['fi_provider']);
			nFile['structtype']		=(nFile['fi_structtype']=='')?(''):(nFile['fi_structtype']);
	
			nFile['maincode']			=nFile['fi_maincode'];
			nFile['extension']		=nFile['fi_extension'];

			nFile['loaded']				=0;
			nFile['show']					=0;
			
	
			if(  (typeof(nFile['gr_id'])!='undefined') && (nFile['gr_id'].length>0)  ){
				nFile['gr_id']	= nFile['gr_id'];
				nFile['us_id']	= nFile['us_id'];
			}else{
				nFile['gr_id']	= 0;
				nFile['us_id']	= 0;
			}
			
			if(  (typeof(nFile['gr_sharedid'])!='undefined') && (nFile['gr_sharedid'].length>0)  ){
				nFile['sharedid']		= nFile['gr_sharedid'];
				nFile['pid']			= folderId;
	
	//document.getElementById('c1').innerHTML += 'x4 fi_pid'+ nFile['pid'] +' folderId'+ folderId +' pid'+ pid +'<br>';
	
				if(  (nFile['pid']==0) || (nFile['pid'].length<1)  ){
					if(  (typeof(nFile['gr_id'])!='undefined') && (nFile['gr_id']>0)  ){
						nFile['pid'] = nFile['gr_id'];
						if(  (typeof(nFile['us_id'])!='undefined') && (nFile['us_id']>0)  ){
							nFile['pid'] += '_' + nFile['us_id'];
						}
					}
				}
	//document.getElementById('c1').innerHTML += 'x4 fi_pid'+ nFile['pid'] +' folderId'+ folderId +' pid'+ pid +'<br>';
				
				nFile['id']					= nFile['pid'] + '_' + nFile['id'];
	
	//			nFile['pid']				= folderId;
	//			nFile['id']					= nFile['pid'] + '_s' + nFile['sharedid'] +'_'+ nFile['pid'];
			}else{
	/*			if(  folderId.indexOf(nFile['pid'])==-1  ){
					folderId += '_' + nFile['pid'];
				}
	*/			
				nFile['sharedid']		= shareId;
				
				
				var i04=0;
				var L04=0;
				var pid='';
				if(  folderId.indexOf(nFile['real_pid'])==-1  ){
					while(  i04<nFiles.length  ){
						if( (nFiles[i04]['sharedid']==nFile['sharedid']) && (nFiles[i04]['real_id']==nFile['real_pid']) ){
							pid=nFiles[i04]['id'];
	
							break;
						}
						i04++;
					}
				}else{
					pid=folderId;
				}
				
				if( pid.length<1 ){
	//				alert('error');
				}
	
				nFile['pid']	= pid;
				nFile['id']		= nFile['pid'] + '_' + nFile['id'];
			}
			
			nFile['show']			=0;
		
			var j=0;
			var L=0;																																								// delete repeat elements
			while(  (typeof(nFiles)!='undefined') && (typeof(nFiles[j])!='undefined')  ){
				if(  (nFiles[j]['id']==nFile['id']) && (nFiles[j]['pid']==nFile['pid']) && (nFiles[j]['name']==nFile['name'])  ){
					L=1;
					break;
				}
		
				j++;
			}
	
			if(  L==0  ){
				nFiles[nFiles.length]=nFile;
			}
			
			i++;
		}//while
	
//		nFiles = sortFolder(nFiles, 1);				// Sort folders
//		nFiles = sortFolder(nFiles, 0);				// Sort files
		
		var result = nFiles;
		i=0;
		var nFiles2=nFiles;
		var res='';
		while(  (typeof(nFiles2)!='undefined') && (typeof(nFiles2[i])!='undefined')  ){
			if(  (typeof(nFiles2[i]['branch'])!='undefined') && (typeof(nFiles2[i]['branch']['n0'])!='undefined')  ){
				res = this.getTreeByLevels(nFiles2[i]['branch'], nFiles2[i]['id'], nFiles2[i]['sharedid'], sharer, nFiles2[i]['us_id']);
				var j1=0;
				var j2=result.length;
				while(  (typeof(res)!='undefined') && (typeof(res[j1])!='undefined')  ){
					result[j2]=res[j1];
					j1++;
					j2++;
				}
			}
	
			i++;
		}//while
	
		return result;
	}
//------------------------------------------------------------------------------------------
	prototype.getIcon=function(ext){
		var img=this.pathToFileIcons + 'file.gif';
		if(  typeof(ext)=="undefined"  ){
			return img;
		}
		
		img=this.pathToFileIcons;
		switch ( ext.toLowerCase() ) {
			case 'zip' :
				img+='zip.gif';
				break;
			case 'rar' :
				img+='rar.gif';
				break;
			case 'jpg' :
				img+='jpg.gif';
				break;
			case 'jpeg' :
				img+='jpg.gif';
				break;
			case 'jpe' :
				img+='jpg.gif';
				break;
			case 'bmp' :
				img+='jpg.gif';
				break;
			case 'tiff' :
				img+='jpg.gif';
				break;
			case 'gif' :
				img+='jpg.gif';
				break;
			case 'png' :
				img+='jpg.gif';
				break;
			case 'psd' :
				img+='jpg.gif';
				break;
			case 'tga' :
				img+='jpg.gif';
				break;
			case 'txt' :
				img+='txt.gif';
				break;
			case 'doc' :
				img+='doc.gif';
				break;
			case 'htm' :
				img+='htm.gif';
				break;
			case 'html' :
				img+='htm.gif';
				break;
			case 'js' :
				img+='txt.gif';
				break;
			case 'avi' :
				img+='avi.gif';
				break;
			case 'mpg' :
				img+='mpg.gif';
				break;
			case 'mp3' :
				img+='mp3.gif';
				break;
			case 'wav' :
				img+='wav.gif';
				break;
			case 'exe' :
				img+='exe.gif';
				break;
			case 'pdf' :
				img+='pdf.gif';
				break;
				
			case '%group' :
				img+='group.gif';
				break;
			case '%user' :
				img+='user.gif';
				break;

			default :
				img=this.pathToFileIcons + 'file.gif';
		}
		
		return img;
	}
//------------------------------------------------------------------------------------------
	prototype.mOpen=function(){
		var i=0;
		var c=0;
		var folder='';
		var id='';
		var maincode='';
		var extension='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected())  ){
				id					=this.mainTree[i]['id'];
				folder			=this.mainTree[i]['type'];
				maincode		=this.mainTree[i]['maincode'];
				extension		=this.mainTree[i]['extension'];
				c++;
			}
			i++;
		}

		if(  c==0  ){
			Ext.Msg.alert('Error', 'Choose file, what you want to open');
			return -2;
		}
		
		if(  c>1  ){
			Ext.Msg.alert('Error', 'Choose only one file');
			return -2;
		}
		
		if(  folder==1  ){
			Ext.Msg.alert('Error', ' &nbsp; &nbsp; Choose <b>file</b> &nbsp; &nbsp; ');
			return -3;
		}

		var L=0;
		var url;
		if(  (extension=='pdf') || (extension=='doc') || (extension=='docx') || (extension=='ppt') || (extension=='pptx') || (extension=='tiff')  ){
			url= 'http://docs.google.com/viewer?url=' + encodeURIComponent(this.server_sme + '/files/' + maincode + '.' + extension);
			L=1;
		}
	
		if(  L==1 ){
			window.open(url);
		}
		
	}
//------------------------------------------------------------------------------------------
	prototype.mEmail=function(){
		var i=0;
		var L=0;
		var c=0;
		var folder='';
		var name='';
		var description='';
		var tags='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected())  ){
				folder=this.mainTree[i]['type'];
				name=this.mainTree[i]['name'];
				description=this.mainTree[i]['description'];
				tags=this.mainTree[i]['tags'];
				c++;
			}
			i++;
		}

		if(  c==0  ){
			Ext.Msg.alert('Error', 'Choose file or folder, what you want to modify');
			return -2;
		}
		
		if(  c>1  ){
			Ext.Msg.alert('Error', 'Choose only one file or folder');
			return -2;
		}
		
		if(  folder==1  ){
			Ext.Msg.alert('Error', ' &nbsp; &nbsp; Choose <b>file</b> &nbsp; &nbsp; ');
			return -3;
		}

		var html='';	
		var handler;
		var caption='Send a file on email';
		var html_header = '<div class="x-window-header">'+ caption +'</div>';
		
		html+= '<table border="0" cellpadding="3" cellspacing="5" align="center" class="SMEStorageSFModalbox">';
		html+= '	<tr>';
		html+= '		<td>File name: </td>';
		html+= '		<td><input type="text" value="'+ name +'" id="Email_fileName" size="40" disabled class="SMEStorageSFModalbox"></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td>Email: &nbsp;</td>';
		html+= '		<td><input type="text" value="" id="Email_email" size="40" class="SMEStorageSFModalbox"></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td>From name: &nbsp;</td>';
		html+= '		<td><input type="text" value="" id="Email_name" size="40" class="SMEStorageSFModalbox"></td>';
		html+= '	</tr>';
		html+= '	<t>';
		html+= '		<td colspan="2">Message: &nbsp;</td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td colspan="2"><textarea id="Email_message" style="width:99%; height:125;" class="SMEStorageSFModalbox"></textarea></td>';
		html+= '	</tr>';
		html+= '</table>';
		
		document.getElementById('SMEStorageSFModalbox').innerHTML = html_header;
		
		var win = new Ext.Window({
			applyTo:'SMEStorageSFModalbox',
			layout:'fit',
			width:350,
			height:305,
			closeAction:'hide',
			plain: true,
			modal: true,
			
			items: [{
				html: html
			}],
		
			buttons: [{
				text:'Send',
				handler: function(){
					SMEStorageSF.doEmail();
				}
			},{
				text: 'Cancel',
				handler: function(){
					SMEStorageSF.modalbox.hide();
				}
			}]
		});

		win.show(this);

		this.modalbox=win;
	}
//------------------------------------------------------------------------------------------
	prototype.doEmail=function(id, email, name, message){
		var i=0;
		var L=0;
		if(  (typeof(id)=="undefined") || (id.length<1)  ){
			id='';
			email = document.getElementById("Email_email").value;
			name = document.getElementById("Email_name").value;
			message = document.getElementById("Email_message").value;
			message=message.replace(/\r\n|\r|\n/g,'<br>');
	
			if( email.length<1 ){
				Ext.Msg.alert('Error', 'Enter email');
				document.getElementById("Email_email").focus();
				return 0;
			}
			
			if( email.indexOf('@')==-1 ){
				Ext.Msg.alert('Error', 'Not correct email');
				document.getElementById("Email_email").focus();
				return 0;
			}
			
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if(  (typeof(this.mainTree[i]['node'])!="undefined") && (typeof(this.mainTree[i]['node']['id'])!="undefined") && (this.mainTree[i]['node'].isSelected())  ){
					id=this.mainTree[i]['id'];
					break;
				}
				i++;
			}
		}
		
		var f='';
		var p=[];
		p[0]=id;
		p[1]=email;
		p[2]=name;
		p[3]=message;
		p[4]='0';

		this.modalbox.hide();
		this.runFunction('doSendEmail', p, 'Send file to &nbsp; '+ email +'<br><br>Please wait...', 'doEmailResp();');
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.doEmailResp=function(id, name, description, tags){
		Ext.Msg.alert('Success', 'Success');
		
		return 0;
	}
//==========================================================================================
// Functions for sending requests to server
//==========================================================================================
// name - name API function
// p - parameters
// msg - message for modalbox
// func - prototype.which needs to be caused after a request.
	prototype.runFunction=function(name, p, msg, func){
		if(  this.waitResult!=0  ){
			if(  name.indexOf('gettoken')==-1  ){
				this.timerID=setTimeout("SMEStorageSF.runFunction('"+ name +"', '"+ p +"', '"+ msg +"', '"+ func +"')", 100);
			}
			return -1;
		}

		if(  (typeof(this.rqP)!="undefined") && (typeof(this.rqP[0])!="undefined") && (name!="gettoken")  ){
			p=this.rqP;
		}
		
		var token=this.userInfo['token'];
		if( name.indexOf('gettoken')>-1 ){
			token='*';
		}
		
		var url=this.server_sme_api+'/'+token+'/'+name+'/';
		var L=0;
		var i=0;
		while(  (typeof(p)!="undefined") && (typeof(p[i])!="undefined")  ){
			if(  L!=0  ){
				url += ',';
			}else{
				L=1;
			}
			
			if( (typeof(p[i])!='string') ){		
				p[i]=p[i]+'';
			}
			url+=this.encode64(p[i]);
	
			i++;
		}
		
		url=this.encode64(url);
		url=this.script_for_resend_request + url;

		if(  (name.indexOf('gettoken')==-1) && (token=='*')  ){
			this.waitResult=0;
			this.signIn(1);
			this.rqP=p;
			this.timerID=setTimeout ("SMEStorageSF.runFunction('"+ name +"', '"+ p +"', '"+ msg +"', '"+ func +"')", 100);
//		this.timerID=setInterval("SMEStorageSF.runFunction('"+ name +"', '"+ p +"', '"+ msg +"', '"+ func +"')", 100);
			return 0;
		}
		
		this.sendRequestToServer(name, p, url, msg, func);
	}
//------------------------------------------------------------------------------------------
	prototype.sendRequestToServer=function(name, p, url, msg, func){
		this.waitResult2=1;
		if(  this.timerID>0  ){
			clearInterval(this.timerID);
			this.timerID='';
		}

		this.waitResult=1;
		this.responseData='';
		if( (typeof(msg)!="undefined") && (msg.length>0) && (msg!="undefined") ){
			Ext.get('mainTreeSharedFilesBorder').mask(msg);
		}

		if( func.indexOf(this.externalName)==-1 ){
			func = this.externalName +'.'+ func;
		}

		Ext.Ajax.request({
			 url : url,
			 params : {},
			 maskEl : 'mainTreeSharedFilesBorder',
			 func : func,
			 name : name,
			 p : p
		});
		
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.ajaxResponse=function(conn, response, options){
		if( this.waitResult2==0 ){
			return null;
		}

		this.waitResult2=0;
		if(  options.func.indexOf('signInResp')==-1  ){
			this.waitResult=0;
			this.rqP='';
		}
	
		try{
			response.responseJSON = Ext.util.JSON.decode(response.responseText);
		}catch(e){ 
			response.responseJSON = false;
			Ext.get(options.maskEl).unmask();
			Ext.Msg.alert('Error', 'Server return not valid result.');
			return -3;
		}
	
		if (response.responseJSON) {
			if( response.responseJSON.error ){
				Ext.get(options.maskEl).unmask();
				clearInterval(this.timerID);
				this.timerID='';
				Ext.Msg.alert('Error', 'Error 101. Server not return result.');
				return -1;
			}
		}else{
			Ext.get(options.maskEl).unmask();
			clearInterval(this.timerID);
			this.timerID='';
			Ext.Msg.alert('Error', 'Error 102. Server not return result.');
			return -2;
		}
	
		if(  (typeof(response.responseJSON['status'])=="undefined")  ){
			Ext.get(options.maskEl).unmask();
			clearInterval(this.timerID);
			this.timerID='';
			Ext.Msg.alert('Error', 'Server not return status.');
			return -4;
		}
		
		if(  (response.responseJSON['status']=='login_token_expired') || (response.responseJSON['status']=='login_fail')  ){
			if(  options.func.indexOf('signInResp')==-1  ){
				if(  this.timerID>0  ){
					clearInterval(this.timerID);
					this.timerID='';
				}
				
				this.signIn();
				this.rqP=options.p;
					this.timerID=setTimeout ("SMEStorageSF.runFunction('"+ options.name +"', '"+ options.p +"', '"+ options.msg +"', '"+ options.func +"')", 100);
//				this.timerID=setInterval("SMEStorageSF.runFunction('"+ options.name +"', '"+ options.p +"', '"+ options.msg +"', '"+ options.func +"')", 100);
				return 0;
			}

			Ext.get(options.maskEl).unmask();
			Ext.Msg.alert('Error', 'Login token expired.');
			return -5;
		}
	
		if(  (response.responseJSON['status'] != 'ok')  ){
			if(  (typeof(response.responseJSON['statusmessage'])!="undefined") && (response.responseJSON['statusmessage'].length>0)  ){
				Ext.get(options.maskEl).unmask();
				Ext.Msg.alert('Error', response.responseJSON['statusmessage']);
				return -6;
			}
			
			Ext.get(options.maskEl).unmask();
			Ext.Msg.alert('Error', 'Error');
			return -6;
		}
		
		this.responseData=response.responseJSON;
		setTimeout(options.func, 1);
		
		if(  options.func.indexOf('signInResp')==-1  ){
			Ext.get(options.maskEl).unmask();
		}
		
		return 0;
	}
//==========================================================================================
// Functions for use base64
//==========================================================================================
	prototype.encode64=function(input){
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output='';
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			
			output+=keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
		}
		return output;
	}
//------------------------------------------------------------------------------------------
	prototype.decode64=function(input) {
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output ='';
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		
		// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		
		while (i < input.length) {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));
			
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			
			output +=(String.fromCharCode(chr1));
			
			if (enc3 != 64) {
				output +=(String.fromCharCode(chr2));
			}
			if (enc4 != 64) {
				output +=(String.fromCharCode(chr3));
			}
		}
		return output;
	}
}
//==========================================================================================

var SMEStorageSF;
Ext.onReady(function(){

	SMEStorageSF = new SMEStorageSharedFiles();
	SMEStorageSF.externalName="SMEStorageSF";

	setTimeout("SMEStorageSF.searchMainTree();", 250);
//------------------------------------------------------------------------------------------------------------------------------------
	Ext.Ajax.on('requestexception', function (conn, response, options) {
		if(  (typeof(options.func)!="undefined") && (options.func.indexOf('SMEStorageSF')!=-1)  ){
			SMEStorageSF.ajaxResponse(conn, response, options);
			return 0;
		}


	});
//------------------------------------------------------------------------------------------------------------------------------------
	Ext.Ajax.on('requestcomplete', function (conn, response, options) {
		if(  (typeof(options.func)!="undefined") && (options.func.indexOf('SMEStorageSF')!=-1)  ){
			SMEStorageSF.ajaxResponse(conn, response, options);
			return 0;
		}


	});
//------------------------------------------------------------------------------------------------------------------------------------

});