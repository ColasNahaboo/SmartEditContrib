/***************************
Copyright (C) 2006 Gaël Crova

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version. 

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. 

You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
****************************/
var twikismartTextAreaRows = 0;
var twikismartEngineAction = false;
var twikismartListToInsert = false;
var twikismartListToDelete = false;
var twikismartSpaceToAdd = false;
var twikismartSpaceToAddText = "";
var twikismartListType = "";
var twikismartAdjustActivated = false;
var smartEditPopup="";
var smartEditFirstWikiLink = true;

function twikismartInsertBold(){
	twikismartInitializeAllAttributes();
	var twikismartStartSelectionAdd = 0;
	var twikismartEndSelectionAdd = 0; // Ce qu'il faudra retirer de la longueur de la chaine finale
	var lines = twikismartGetLines(twikismartSelection);
	if(twikismartSelection == null || twikismartIsEmptyString(twikismartSelection)){
		twikismartSelection = "Bold Text";
		lines[0] = twikismartSelection;
	}
	// Pour chaque ligne, inserer le tag avant le premier caractere en prenant en compte si on ajoute ou non un blanc
	
	var twikismartFinalText = "";
	if(lines != null && lines.length > 0){
		for(var i=0;i<lines.length;i++){
			var tmpline = lines[i];			
			
			// Prendre en compte le cas ou i=0 pour voir le premier caractere avant la selection ( blanc ou \n ou autre ......
			if(i==0 && tmpline.indexOf("\n") == -1){ // Cas d'une selection sans \n ou d'une premiere ligne de selection non complete
			
				// Tag ouvrant
				var fchr = twikismartIndexOfFirstCharacter(tmpline);
				if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, il faut regarder si le caracter d'avant dans la textarea est un blanc
					var strbefore = twikismartTextareaContent.substring(0,twikismartStartIndex);
					if((strbefore.lastIndexOf(" ") == strbefore.length - 1) || (strbefore.lastIndexOf("\n") == strbefore.length - 1)){ // Il y a bien un blanc avant dc on insere juste la bullet
						lines[i] = "*"+lines[i];
						twikismartStartSelectionAdd = 1;
					}
					else{ // Pas de blanc, donc il faut en inserer un ! 
						lines[i] = " *"+lines[i];
						twikismartStartSelectionAdd = 2;
					}
				}
				else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
					lines[i] = lines[i].substring(0,fchr)+"*"+lines[i].substring(fchr,lines[i].length);
					twikismartStartSelectionAdd = fchr+1;
				}
				
				// Tag fermant
				
				tmpline = lines[i];
				var fechr = twikismartIndexOfLastCharacter(tmpline);				
				
				if(lines.length == 1){ // Cas ou il n'y aurait qu'une seule ligne de selectionnée
					if(fechr == (tmpline.length-1)){ // Le dernier caractere se trouve en derniere position de cette ligne ... il faut verifier le caractere suivant
						var strafter = twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
						if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
							lines[i]=lines[i]+"*";
							twikismartEndSelectionAdd = 1;
						}
						else{ // Sinon, il faut en rajouter un (d'espace)
							lines[i]=lines[i]+"* ";
							twikismartEndSelectionAdd = 2;
						}
	 				}
					else{ // Sinon, il suffit de rajouter la bullet apres le dernier caractere
						lines[i] = lines[i].substring(0,fechr+1)+"*"+lines[i].substring(fechr+1,lines[i].length);
						twikismartEndSelectionAdd = 2;
					}
				}
				else{
					// Sinon, il suffit d'inserer la bullet juste apres le dernier caractere de la ligne
					lines[i] = lines[i].substring(0,fechr+1)+"*"+ lines[i].substring(fechr+1,lines[i].length);
				}
			}
			// Ensuite gérer ces lignes de sélection pour bien insérer les bons tags aux bons endroits
			else{
				// Si la ligne est vide .. ne rien toucher
				if(!twikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
				
					// Tag ouvrant
				
					var fchr = twikismartIndexOfFirstCharacter(tmpline.substring(1,tmpline.length));
					if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, alors le caractere avant est un retour a la ligne dc pas besoin d'espace
						lines[i] = "\n*"+tmpline.substring(1,tmpline.length);
						if(i==0){
							twikismartStartSelectionAdd = 1;
						}
					}
					else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
						if( fchr >= 1){ // Si c'est ailleur, c'est qu'il y a un blanc avant donc juste inserer avant le premier caractere
							lines[i] = lines[i].substring(0,fchr+1)+"*"+lines[i].substring(fchr+1,lines[i].length);
							if(i==0){
								twikismartStartSelectionAdd = fchr;
							}
						}
						else{ // BUG
						}
					}
					
					// Tag fermant
					
					tmpline = lines[i];
					var fechr = twikismartIndexOfLastCharacter(tmpline);
					if(fechr < tmpline.length-1){ // Le dernier caractere ne se trouve pas a la fin de la ligne donc on peut inserer directement la bullet
						lines[i] = lines[i].substring(0,fechr+1)+"*"+lines[i].substring(fechr+1,lines[i].length);
						if(i==lines.length){
							twikismartEndSelectionAdd = 1;
						}
	 				}
					else{ // Sinon, le dernier caractere se trouve a la fin de la ligne ...
						if(i<(lines.length-1)){ // Si ce n'est pas la derniere ligne, alors il y a un retour a la ligne juste apres ... il suffit de rajouter la bullet	
							lines[i] = lines[i]+"*";
						}
						else{ // Sinon, il faut regarder le caracter se trouvant apres dans la textarea
							var strafter = twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
							if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
								lines[i]=lines[i]+"*";
								twikismartEndSelectionAdd = 1;
							}
							else{ // Sinon, il faut en rajouter un (d'espace)
								lines[i]=lines[i]+"* ";
								twikismartEndSelectionAdd = 2;
							}
						}
					}
				}
			}
			twikismartFinalText +=lines[i];
		}
		twikismartTextarea.value = twikismartTextareaContent.substring(0,twikismartStartIndex)+twikismartFinalText+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
		//if(navigator.userAgent.toLowerCase().indexOf("opera") == -1){
			twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+twikismartStartSelectionAdd,twikismartStartIndex+twikismartFinalText.length-twikismartEndSelectionAdd);
			if(is_firefox){
				twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
			}
		//}
		//else{ // Bug pour opera .. il faut rajouter un caractere pour chaque ligne !
			//var nblines = twikismartNbLinesBefore(twikismartStartIndex);
			//twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+twikismartStartSelectionAdd+nblines,twikismartStartIndex+twikismartFinalText.length-twikismartEndSelectionAdd+nblines+lines.length-1);
		//}
	}
}

function twikismartInsertItalic(){
	twikismartInitializeAllAttributes();
	var twikismartStartSelectionAdd = 0;
	var twikismartEndSelectionAdd = 0; // Ce qu'il faudra retirer de la longueur de la chaine finale
	var lines = twikismartGetLines(twikismartSelection);
	if(twikismartSelection == null || twikismartIsEmptyString(twikismartSelection)){
		twikismartSelection = "Italic Text";
		lines[0] = twikismartSelection;
	}
	// Pour chaque ligne, inserer le tag avant le premier caractere en prenant en compte si on ajoute ou non un blanc
	
	var twikismartFinalText = "";
	if(lines != null && lines.length > 0){
		for(var i=0;i<lines.length;i++){
			var tmpline = lines[i];			
			
			// Prendre en compte le cas ou i=0 pour voir le premier caractere avant la selection ( blanc ou \n ou autre ......
			if(i==0 && tmpline.indexOf("\n") == -1){ // Cas d'une selection sans \n ou d'une premiere ligne de selection non complete
			
				// Tag ouvrant
				var fchr = twikismartIndexOfFirstCharacter(tmpline);
				if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, il faut regarder si le caracter d'avant dans la textarea est un blanc
					var strbefore = twikismartTextareaContent.substring(0,twikismartStartIndex);
					if((strbefore.lastIndexOf(" ") == strbefore.length - 1) || (strbefore.lastIndexOf("\n") == strbefore.length - 1)){ // Il y a bien un blanc avant dc on insere juste la bullet
						lines[i] = "_"+lines[i];
						twikismartStartSelectionAdd = 1;
					}
					else{ // Pas de blanc, donc il faut en inserer un ! 
						lines[i] = " _"+lines[i];
						twikismartStartSelectionAdd = 2;
					}
				}
				else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
					lines[i] = lines[i].substring(0,fchr)+"_"+lines[i].substring(fchr,lines[i].length);
					twikismartStartSelectionAdd = fchr+1;
				}
				
				// Tag fermant
				
				tmpline = lines[i];
				var fechr = twikismartIndexOfLastCharacter(tmpline);				
				
				if(lines.length == 1){ // Cas ou il n'y aurait qu'une seule ligne de selectionnée
					if(fechr == (tmpline.length-1)){ // Le dernier caractere se trouve en derniere position de cette ligne ... il faut verifier le caractere suivant
						var strafter = twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
						if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
							lines[i]=lines[i]+"_";
							twikismartEndSelectionAdd = 1;
						}
						else{ // Sinon, il faut en rajouter un (d'espace)
							lines[i]=lines[i]+"_ ";
							twikismartEndSelectionAdd = 2;
						}
	 				}
					else{ // Sinon, il suffit de rajouter la bullet apres le dernier caractere
						lines[i] = lines[i].substring(0,fechr+1)+"_"+lines[i].substring(fechr+1,lines[i].length);
						twikismartEndSelectionAdd = 2;
					}
				}
				else{
					// Sinon, il suffit d'inserer la bullet juste apres le dernier caractere de la ligne
					lines[i] = lines[i].substring(0,fechr+1)+"_"+ lines[i].substring(fechr+1,lines[i].length);
				}
			}
			// Ensuite gérer ces lignes de sélection pour bien insérer les bons tags aux bons endroits
			else{
				// Si la ligne est vide .. ne rien toucher
				if(!twikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
				
					// Tag ouvrant
				
					var fchr = twikismartIndexOfFirstCharacter(tmpline.substring(1,tmpline.length));
					if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, alors le caractere avant est un retour a la ligne dc pas besoin d'espace
						lines[i] = "\n_"+tmpline.substring(1,tmpline.length);
						if(i==0){
							twikismartStartSelectionAdd = 1;
						}
					}
					else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
						if( fchr >= 1){ // Si c'est ailleur, c'est qu'il y a un blanc avant donc juste inserer avant le premier caractere
							lines[i] = lines[i].substring(0,fchr+1)+"_"+lines[i].substring(fchr+1,lines[i].length);
							if(i==0){
								twikismartStartSelectionAdd = fchr;
							}
						}
						else{ // BUG
						}
					}
					
					// Tag fermant
					
					tmpline = lines[i];
					var fechr = twikismartIndexOfLastCharacter(tmpline);
					if(fechr < tmpline.length-1){ // Le dernier caractere ne se trouve pas a la fin de la ligne donc on peut inserer directement la bullet
						lines[i] = lines[i].substring(0,fechr+1)+"_"+lines[i].substring(fechr+1,lines[i].length);
						if(i==lines.length){
							twikismartEndSelectionAdd = 1;
						}
	 				}
					else{ // Sinon, le dernier caractere se trouve a la fin de la ligne ...
						if(i<(lines.length-1)){ // Si ce n'est pas la derniere ligne, alors il y a un retour a la ligne juste apres ... il suffit de rajouter la bullet	
							lines[i] = lines[i]+"_";
						}
						else{ // Sinon, il faut regarder le caracter se trouvant apres dans la textarea
							var strafter = twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
							if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
								lines[i]=lines[i]+"_";
								twikismartEndSelectionAdd = 1;
							}
							else{ // Sinon, il faut en rajouter un (d'espace)
								lines[i]=lines[i]+"_ ";
								twikismartEndSelectionAdd = 2;
							}
						}
					}
				}
			}
			twikismartFinalText +=lines[i];
		}
		twikismartTextarea.value = twikismartTextareaContent.substring(0,twikismartStartIndex)+twikismartFinalText+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
		//if(navigator.userAgent.toLowerCase().indexOf("opera") == -1){
			twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+twikismartStartSelectionAdd,twikismartStartIndex+twikismartFinalText.length-twikismartEndSelectionAdd);
			if(is_firefox){
				twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
			}
		//}
		//else{ // Bug pour opera .. il faut rajouter un caractere pour chaque ligne !
			//var nblines = twikismartNbLinesBefore(twikismartStartIndex);
			//twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+twikismartStartSelectionAdd+nblines,twikismartStartIndex+twikismartFinalText.length-twikismartEndSelectionAdd+nblines+lines.length-1);
		//}
	}
}

function twikismartInsertBoldItalic(){
	twikismartInitializeAllAttributes();
	var twikismartStartSelectionAdd = 0;
	var twikismartEndSelectionAdd = 0; // Ce qu'il faudra retirer de la longueur de la chaine finale
	var lines = twikismartGetLines(twikismartSelection);
	if(twikismartSelection == null || twikismartIsEmptyString(twikismartSelection)){
		twikismartSelection = "Bold Italic Text";
		lines[0] = twikismartSelection;
	}
	// Pour chaque ligne, inserer le tag avant le premier caractere en prenant en compte si on ajoute ou non un blanc
	
	var twikismartFinalText = "";
	if(lines != null && lines.length > 0){
		for(var i=0;i<lines.length;i++){
			var tmpline = lines[i];			
			
			// Prendre en compte le cas ou i=0 pour voir le premier caractere avant la selection ( blanc ou \n ou autre ......
			if(i==0 && tmpline.indexOf("\n") == -1){ // Cas d'une selection sans \n ou d'une premiere ligne de selection non complete
			
				// Tag ouvrant
				var fchr = twikismartIndexOfFirstCharacter(tmpline);
				if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, il faut regarder si le caracter d'avant dans la textarea est un blanc
					var strbefore = twikismartTextareaContent.substring(0,twikismartStartIndex);
					if((strbefore.lastIndexOf(" ") == strbefore.length - 1) || (strbefore.lastIndexOf("\n") == strbefore.length - 1)){ // Il y a bien un blanc avant dc on insere juste la bullet
						lines[i] = "__"+lines[i];
						twikismartStartSelectionAdd = 2;
					}
					else{ // Pas de blanc, donc il faut en inserer un ! 
						lines[i] = " __"+lines[i];
						twikismartStartSelectionAdd = 3;
					}
				}
				else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
					lines[i] = lines[i].substring(0,fchr)+"__"+lines[i].substring(fchr,lines[i].length);
					twikismartStartSelectionAdd = fchr+2;
				}
				
				// Tag fermant
				
				tmpline = lines[i];
				var fechr = twikismartIndexOfLastCharacter(tmpline);				
				
				if(lines.length == 1){ // Cas ou il n'y aurait qu'une seule ligne de selectionnée
					if(fechr == (tmpline.length-1)){ // Le dernier caractere se trouve en derniere position de cette ligne ... il faut verifier le caractere suivant
						var strafter = twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
						if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
							lines[i]=lines[i]+"__";
							twikismartEndSelectionAdd = 2;
						}
						else{ // Sinon, il faut en rajouter un (d'espace)
							lines[i]=lines[i]+"__ ";
							twikismartEndSelectionAdd = 3;
						}
	 				}
					else{ // Sinon, il suffit de rajouter la bullet apres le dernier caractere
						lines[i] = lines[i].substring(0,fechr+1)+"__"+lines[i].substring(fechr+1,lines[i].length);
						twikismartEndSelectionAdd = 3;
					}
				}
				else{
					// Sinon, il suffit d'inserer la bullet juste apres le dernier caractere de la ligne
					lines[i] = lines[i].substring(0,fechr+1)+"__"+ lines[i].substring(fechr+1,lines[i].length);
				}
			}
			// Ensuite gérer ces lignes de sélection pour bien insérer les bons tags aux bons endroits
			else{
				// Si la ligne est vide .. ne rien toucher
				if(!twikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
				
					// Tag ouvrant
				
					var fchr = twikismartIndexOfFirstCharacter(tmpline.substring(1,tmpline.length));
					if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, alors le caractere avant est un retour a la ligne dc pas besoin d'espace
						lines[i] = "\n__"+tmpline.substring(1,tmpline.length);
						if(i==0){
							twikismartStartSelectionAdd = 2;
						}
					}
					else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
						if( fchr >= 1){ // Si c'est ailleur, c'est qu'il y a un blanc avant donc juste inserer avant le premier caractere
							lines[i] = lines[i].substring(0,fchr+1)+"__"+lines[i].substring(fchr+1,lines[i].length);
							if(i==0){
								twikismartStartSelectionAdd = fchr+1;
							}
						}
						else{ // BUG
						}
					}
					
					// Tag fermant
					
					tmpline = lines[i];
					var fechr = twikismartIndexOfLastCharacter(tmpline);
					if(fechr < tmpline.length-1){ // Le dernier caractere ne se trouve pas a la fin de la ligne donc on peut inserer directement la bullet
						lines[i] = lines[i].substring(0,fechr+1)+"__"+lines[i].substring(fechr+1,lines[i].length);
						if(i==lines.length){
							twikismartEndSelectionAdd = 2;
						}
	 				}
					else{ // Sinon, le dernier caractere se trouve a la fin de la ligne ...
						if(i<(lines.length-1)){ // Si ce n'est pas la derniere ligne, alors il y a un retour a la ligne juste apres ... il suffit de rajouter la bullet	
							lines[i] = lines[i]+"__";
						}
						else{ // Sinon, il faut regarder le caracter se trouvant apres dans la textarea
							var strafter = twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
							if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
								lines[i]=lines[i]+"__";
								twikismartEndSelectionAdd = 2;
							}
							else{ // Sinon, il faut en rajouter un (d'espace)
								lines[i]=lines[i]+"__ ";
								twikismartEndSelectionAdd = 3;
							}
						}
					}
				}
			}
			twikismartFinalText +=lines[i];
		}
		twikismartTextarea.value = twikismartTextareaContent.substring(0,twikismartStartIndex)+twikismartFinalText+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
		//if(navigator.userAgent.toLowerCase().indexOf("opera") == -1){
			twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+twikismartStartSelectionAdd,twikismartStartIndex+twikismartFinalText.length-twikismartEndSelectionAdd);
			if(is_firefox){
				twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
			}
		//}
		//else{ // Bug pour opera .. il faut rajouter un caractere pour chaque ligne !
		//	var nblines = twikismartNbLinesBefore(twikismartStartIndex);
		//	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+twikismartStartSelectionAdd+nblines,twikismartStartIndex+twikismartFinalText.length-twikismartEndSelectionAdd+nblines+lines.length-1);
		//}
	}
}

function twikismartInsertFormatted(){
	twikismartInitializeAllAttributes();
	var twikismartStartSelectionAdd = 0;
	var twikismartEndSelectionAdd = 0; // Ce qu'il faudra retirer de la longueur de la chaine finale
	var lines = twikismartGetLines(twikismartSelection);
	if(twikismartSelection == null || twikismartIsEmptyString(twikismartSelection)){
		twikismartSelection = "Formatted Text";
		lines[0] = twikismartSelection;
	}
	// Pour chaque ligne, inserer le tag avant le premier caractere en prenant en compte si on ajoute ou non un blanc
	

	var twikismartFinalText = "";
	if(lines != null && lines.length > 0){
		for(var i=0;i<lines.length;i++){
			var tmpline = lines[i];			
			
			// Prendre en compte le cas ou i=0 pour voir le premier caractere avant la selection ( blanc ou \n ou autre ......
			if(i==0 && tmpline.indexOf("\n") == -1){ // Cas d'une selection sans \n ou d'une premiere ligne de selection non complete
			
				// Tag ouvrant
				var fchr = twikismartIndexOfFirstCharacter(tmpline);
				if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, il faut regarder si le caracter d'avant dans la textarea est un blanc
					var strbefore = twikismartTextareaContent.substring(0,twikismartStartIndex);
					if((strbefore.lastIndexOf(" ") == strbefore.length - 1) || (strbefore.lastIndexOf("\n") == strbefore.length - 1)){ // Il y a bien un blanc avant dc on insere juste la bullet
						lines[i] = "="+lines[i];
						twikismartStartSelectionAdd = 1;
					}
					else{ // Pas de blanc, donc il faut en inserer un ! 
						lines[i] = " ="+lines[i];
						twikismartStartSelectionAdd = 2;
					}
				}
				else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
					lines[i] = lines[i].substring(0,fchr)+"="+lines[i].substring(fchr,lines[i].length);
					twikismartStartSelectionAdd = fchr+1;
				}
				
				// Tag fermant
				
				tmpline = lines[i];
				var fechr = twikismartIndexOfLastCharacter(tmpline);				
				
				if(lines.length == 1){ // Cas ou il n'y aurait qu'une seule ligne de selectionnée
					if(fechr == (tmpline.length-1)){ // Le dernier caractere se trouve en derniere position de cette ligne ... il faut verifier le caractere suivant
						var strafter = twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
						if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
							lines[i]=lines[i]+"=";
							twikismartEndSelectionAdd = 1;
						}
						else{ // Sinon, il faut en rajouter un (d'espace)
							lines[i]=lines[i]+"= ";
							twikismartEndSelectionAdd = 2;
						}
	 				}
					else{ // Sinon, il suffit de rajouter la bullet apres le dernier caractere
						lines[i] = lines[i].substring(0,fechr+1)+"="+lines[i].substring(fechr+1,lines[i].length);
						twikismartEndSelectionAdd = 2;
					}
				}
				else{
					// Sinon, il suffit d'inserer la bullet juste apres le dernier caractere de la ligne
					lines[i] = lines[i].substring(0,fechr+1)+"="+ lines[i].substring(fechr+1,lines[i].length);
				}
			}
			// Ensuite gérer ces lignes de sélection pour bien insérer les bons tags aux bons endroits
			else{
				// Si la ligne est vide .. ne rien toucher
				if(!twikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
				
					// Tag ouvrant
				
					var fchr = twikismartIndexOfFirstCharacter(tmpline.substring(1,tmpline.length));
					if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, alors le caractere avant est un retour a la ligne dc pas besoin d'espace
						lines[i] = "\n="+tmpline.substring(1,tmpline.length);
						if(i==0){
							twikismartStartSelectionAdd = 1;
						}
					}
					else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
						if( fchr >= 1){ // Si c'est ailleur, c'est qu'il y a un blanc avant donc juste inserer avant le premier caractere
							lines[i] = lines[i].substring(0,fchr+1)+"="+lines[i].substring(fchr+1,lines[i].length);
							if(i==0){
								twikismartStartSelectionAdd = fchr+1;
							}
						}
						else{ // BUG
						}
					}
					
					// Tag fermant
					
					tmpline = lines[i];
					var fechr = twikismartIndexOfLastCharacter(tmpline);
					if(fechr < tmpline.length-1){ // Le dernier caractere ne se trouve pas a la fin de la ligne donc on peut inserer directement la bullet
						lines[i] = lines[i].substring(0,fechr+1)+"="+lines[i].substring(fechr+1,lines[i].length);
						if(i==lines.length){
							twikismartEndSelectionAdd = 1;
						}
	 				}
					else{ // Sinon, le dernier caractere se trouve a la fin de la ligne ...
						if(i<(lines.length-1)){ // Si ce n'est pas la derniere ligne, alors il y a un retour a la ligne juste apres ... il suffit de rajouter la bullet	
							lines[i] = lines[i]+"=";
						}
						else{ // Sinon, il faut regarder le caracter se trouvant apres dans la textarea
							var strafter = twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
							if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
								lines[i]=lines[i]+"=";
								twikismartEndSelectionAdd = 1;
							}
							else{ // Sinon, il faut en rajouter un (d'espace)
								lines[i]=lines[i]+"= ";
								twikismartEndSelectionAdd = 2;
							}
						}
					}
				}
			}
			twikismartFinalText +=lines[i];
		}
		twikismartTextarea.value = twikismartTextareaContent.substring(0,twikismartStartIndex)+twikismartFinalText+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
		//if(navigator.userAgent.toLowerCase().indexOf("opera") == -1){
			twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+twikismartStartSelectionAdd,twikismartStartIndex+twikismartFinalText.length-twikismartEndSelectionAdd);
			if(is_firefox){
				twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
			}
		//}
		//else{ // Bug pour opera .. il faut rajouter un caractere pour chaque ligne !
			//var nblines = twikismartNbLinesBefore(twikismartStartIndex);
			//twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+twikismartStartSelectionAdd+nblines,twikismartStartIndex+twikismartFinalText.length-twikismartEndSelectionAdd+nblines+lines.length-1);
		//}
	}
}


function twikismartInsertBullet(){
	twikismartInitializeAllAttributes();
	var lines = twikismartGetLines(twikismartSelection);
	var firstchange = false;
	var finaltext = "";
	if(twikismartSelection.length == 0){
		var indice = (twikismartTextareaContent.substring(0,twikismartStartIndex)).lastIndexOf("\n");
		var stringbefore = twikismartTextareaContent.substring(0,indice+1);
		var endindice = (twikismartTextareaContent.substring(twikismartStartIndex,twikismartTextareaContent.length)).indexOf("\n");
		if(endindice == -1){
			endindice = twikismartTextareaContent.length;
		}
		else{
			endindice=twikismartStartIndex+endindice;
		}
		var stringafter = twikismartTextareaContent.substring(endindice,twikismartTextareaContent.length);
		var texttotest = twikismartTextareaContent.substring(indice+1,endindice);
		var contains = twikismartTextContainsBullet(texttotest);
		if(contains){
			// Si la ligne contient une bullet .. il faut l'enlever
			twikismartTextareaContent = stringbefore+twikismartDeleteBulletInto(texttotest)+stringafter;
			//For selection parameters
			twikismartStartIndex=(stringbefore+twikismartDeleteBulletInto(texttotest)).length;
			// Else .. maybe bug but no bullet to delete
		}
		else{
			//Sinon il faut en rajouter une tout en gardant l'indentation existante ( pas de contexte par rapport aux lignes précédentes
			// Mais on regarde avant si il n'y a pas une liste d'un autre type
			var containsNumList = twikismartTextContainsNumBullet(texttotest);
			if(containsNumList){ // S'il y en a une, il faut l'enlever avant
				texttotest = twikismartDeleteBulletInto(texttotest);
			}
			 // puis il faut juste mettre la bullet
			var stringtoadd = twikismartInsertBulletInto(texttotest);
			twikismartTextareaContent = stringbefore+stringtoadd+stringafter;
			twikismartStartIndex=(stringbefore+stringtoadd).length;
			
		}
	}
	// Before copy paste
	else{
		if(lines != null && lines.length > 0){
			var contains = -2;
			var tmp ="";
			for(var i=0;i<lines.length;i++){
				if(i==0){
					var indice = (twikismartTextareaContent.substring(0,twikismartStartIndex)).lastIndexOf("\n");
					if(indice == -1){
						indice = 0;
					}
					lines[i] = twikismartTextareaContent.substring(indice,twikismartStartIndex)+lines[i];
					twikismartStartIndex = indice;
				}
				if(contains == -2){ // Initialize this variable just one time
					contains = twikismartContainsBullet(lines); 
				}
				if(lines[i].length != 0 && !(lines[i].length == 1 && lines[i].indexOf("\n") == 0)){
					if(i==0 && lines[i].indexOf("\n") == -1){
						if(contains == 0){
							// Delete bullet .... all list are bullet so no need to delete a num list
							var theindex = lines[i].indexOf("   * ");
							if(theindex != -1){
								lines[i] = twikismartDeleteBulletInto(lines[i]);
							}
						}
						else{
							if(contains == 1){
								//Search if there is a bullet -> if no add one 
								// If a numlist is detected, we have to delete it !
								var containsNumList = twikismartTextContainsNumBullet(lines[i]);
								if(containsNumList){ // S'il y en a une, il faut l'enlever avant
									lines[i] = twikismartDeleteBulletInto(lines[i]);
								}
								if(!twikismartTextContainsBullet(lines[i])){
									var oldL = lines[i].length;
									lines[i] = twikismartInsertBulletInto(lines[i]);
								}
								// Else don't touch
							}
							else{
								// Insert a bullet
								// Before, we have to delete num list if detected
								var containsNumList = twikismartTextContainsNumBullet(lines[i]);
								if(containsNumList){ // S'il y en a une, il faut l'enlever avant
									lines[i] = twikismartDeleteBulletInto(lines[i]);
								}
								var oldL = lines[i].length;
								lines[i] = twikismartInsertBulletInto(lines[i]);
							}
						}	
					}
					else{
						if(!twikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
							if(contains == 0){
								// Delete bullet
								var theindex = lines[i].indexOf("   * ");
								if(theindex != -1){
									lines[i] = lines[i].substring(0,theindex+3)+lines[i].substring(theindex+5,lines[i].length);
								}
							}
							else{
								if(contains == 1){
									//Search if there is a bullet -> if no add one   twikismartTextContainsBullet
									var containsNumList = twikismartTextContainsNumBullet(lines[i].substring(1,lines[i].length));
									if(containsNumList){ 
										lines[i] = "\n"+twikismartDeleteBulletInto(lines[i].substring(1,lines[i].length));
									}
									if(!twikismartTextContainsBullet(lines[i].substring(1,lines[i].length))){
										lines[i] = lines[i].substring(0,1)+twikismartInsertBulletInto(lines[i].substring(1,lines[i].length));
									}
								}
								else{
									// Insert a bullet
									var containsNumList = twikismartTextContainsNumBullet(lines[i].substring(1,lines[i].length));
									if(containsNumList){ 
										lines[i] = "\n"+twikismartDeleteBulletInto(lines[i].substring(1,lines[i].length));
									}
									lines[i] = lines[i].substring(0,1)+twikismartInsertBulletInto(lines[i].substring(1,lines[i].length));
								}
							}
						}
					}
				}
				tmp+=lines[i];
			}
			finaltext = tmp;
		}
		twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+finaltext+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	}
	// After copy/paste
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartStartIndex++;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex,twikismartStartIndex+finaltext.length-1);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
}

function twikismartInsertBulletInto(thetext){
	if(thetext != null && thetext.length > 0){
		var fchar = twikismartIndexOfFirstCharacter(thetext);
		// nb of three spaces :
		var fcharreste = fchar%3; // nb d'espaces restant apres les groupes de 3 espaces
		var fcharint = (fchar-fcharreste)/3;
		if(fcharint==0){
			thetext = thetext.substring(0,fchar-fcharreste)+"   * "+thetext.substring(fchar,thetext.length);
		}
		else{
			thetext = thetext.substring(0,fchar-fcharreste)+"* "+thetext.substring(fchar,thetext.length);
		}
	}
	else{
		if(thetext.length == 0){
			return "   * ";
		}
	}
	return thetext;
}

function twikismartInsertNumBulletInto(thetext){
	if(thetext != null && thetext.length > 0){
		var fchar = twikismartIndexOfFirstCharacter(thetext);
		// nb of three spaces :
		var fcharreste = fchar%3; // nb d'espaces restant apres les groupes de 3 espaces
		var fcharint = (fchar-fcharreste)/3;
		if(fcharint==0){
			thetext = thetext.substring(0,fchar-fcharreste)+"   1 "+thetext.substring(fchar,thetext.length);
		}
		else{
			thetext = thetext.substring(0,fchar-fcharreste)+"1 "+thetext.substring(fchar,thetext.length);
		}
	}
	else{
		if(thetext.length == 0){
			return "   1 ";
		}
	}
	return thetext;
}

function twikismartDeleteBulletInto(thetext){
	var begin = 3*twikismartIndexOfBullet(thetext);
	begin+=3;
	if(begin >= 0){ // Index of the bullet
		thetext = thetext.substring(0,begin)+ thetext.substring(begin+2,thetext.length);
	}
	return thetext;
}

// Test a string that contains \n character at the first place
function twikismartTextContainsBullet(texttotest){
	if(texttotest != null && texttotest.length > 0){
		if(texttotest.indexOf("   * ") >= 0){
			if(twikismartIsEmptyString(texttotest.substring(1,texttotest.indexOf("   * ")))){
				return true;
			}
		}
	}

	return false; // aucune bullet détectée, il faut donc les mettre
}

function twikismartTextContainsNumBullet(texttotest){
	if(texttotest != null && texttotest.length > 0){
		if(texttotest.indexOf("   1 ") >= 0){
			if(twikismartIsEmptyString(texttotest.substring(1,texttotest.indexOf("   1 ")))){
				return true;
			}
		}
	}

	return false; // aucune bullet détectée, il faut donc les mettre
}

function twikismartContainsBullet(list){
	if(list != null && list.length > 0){
		var all = 0;
		var avlines = 0;
		if(list.length == 1){
			if(twikismartTextContainsBullet(list[0])){
				return 0;
			}
			else{
				return -1;
			}
		}
		for(var i=0;i<list.length;i++){
			var tmp = list[i];
			if(tmp.indexOf("   * ") >= 0){
				if(twikismartIsEmptyString(tmp.substring(1,tmp.indexOf("   * ")))){
					all++;
				}
			}
			if(tmp.length > 1 || (tmp.length == 1 && tmp.indexOf("\r") != 0 && tmp.indexOf("\n") != 0 )){
				avlines++;
			}
		}
		if(all == avlines){ // all lines are bullet -> we can delete the bullet !
			return 0;
		}
		else{ // some lines are bullet, others none ... on met donc les bullet ds les lignes ki n'en contiennent pas
			return 1;
		}
	}
	return -1; // aucune bullet détectée, il faut donc les mettre
}

function twikismartContainsNumBullet(list){
	if(list != null && list.length > 0){
		var all = 0;
		var avlines = 0;
		if(list.length == 1){
			if(twikismartTextContainsNumBullet(list[0])){
				return 0;
			}
			else{
				return -1;
			}
		}
		for(var i=0;i<list.length;i++){
			var tmp = list[i];
			if(tmp.indexOf("   1 ") >= 0){
				if(twikismartIsEmptyString(tmp.substring(1,tmp.indexOf("   1 ")))){
					all++;
				}
			}
			if(tmp.length > 1 || (tmp.length == 1 && tmp.indexOf("\r") != 0 && tmp.indexOf("\n") != 0 )){
				avlines++;
			}
		}
		if(all == avlines){ // all lines are bullet -> we can delete the bullet !
			return 0;
		}
		else{ // some lines are bullet, others none ... on met donc les bullet ds les lignes ki n'en contiennent pas
			return 1;
		}
	}
	return -1; // aucune bullet détectée, il faut donc les mettre
}

function twikismartIndexOfBullet(text){
	var result = -1;
	twikismartListType = "";
	twikismartListToDelete = false;
	if(text.indexOf("   1 ") >= 0){
		while(text.indexOf("   ") == 0){
			text = text.substring(3,text.length);
			twikismartListType+="   ";
			result++;
		}
		twikismartListType+="1 ";
		if(text.indexOf("1 ") == 0){
			if(twikismartIsEmptyString(text.substring(2,text.length))){
				twikismartListToDelete = true;
				return -1;
			}
			else{
				twikismartListToDelete = false;
			}
			return result;
		}
	}
	else{
		if(text.indexOf("   * ") >= 0){
			while(text.indexOf("   ") == 0){
				text = text.substring(3,text.length);
				twikismartListType+="   ";
				result++;
			}
			twikismartListType+="* ";
			if(text.indexOf("* ") == 0){
				
				if(twikismartIsEmptyString(text.substring(1,text.length))){
					twikismartListToDelete = true;
					return -1;
				}
				else{
					twikismartListToDelete = false;
				}
				return result;
			}
		}
	}
	return result;
}

function twikismartInsertNumList(){
	twikismartInitializeAllAttributes();
	var lines = twikismartGetLines(twikismartSelection);
	var firstchange = false;
	var finaltext = "";
	if(twikismartSelection.length == 0){
		var indice = (twikismartTextareaContent.substring(0,twikismartStartIndex)).lastIndexOf("\n");
		var stringbefore = twikismartTextareaContent.substring(0,indice+1);
		var endindice = (twikismartTextareaContent.substring(twikismartStartIndex,twikismartTextareaContent.length)).indexOf("\n");
		if(endindice == -1){
			endindice = twikismartTextareaContent.length;
		}
		else{
			endindice=twikismartStartIndex+endindice;
		}
		var stringafter = twikismartTextareaContent.substring(endindice,twikismartTextareaContent.length);
		var texttotest = twikismartTextareaContent.substring(indice+1,endindice);
		var contains = twikismartTextContainsNumBullet(texttotest);
		if(contains){
			// Si la ligne contient une bullet .. il faut l'enlever
			twikismartTextareaContent = stringbefore+twikismartDeleteBulletInto(texttotest)+stringafter;
			//For selection parameters
			twikismartStartIndex=(stringbefore+twikismartDeleteBulletInto(texttotest)).length;
			// Else .. maybe bug but no bullet to delete
		}
		else{
			var containsBulletList = twikismartTextContainsBullet(texttotest);
			if(containsBulletList){ // S'il y en a une, il faut l'enlever avant
				texttotest = twikismartDeleteBulletInto(texttotest);
			}
			//Sinon il faut en rajouter une tout en gardant l'indentation existante ( pas de contexte par rapport aux lignes précédentes
			var stringtoadd = twikismartInsertNumBulletInto(texttotest);
			twikismartTextareaContent = stringbefore+stringtoadd+stringafter;
			twikismartStartIndex=(stringbefore+stringtoadd).length;
		}
	}
	// Before copy paste
	else{
		if(lines != null && lines.length > 0){
			var contains = -2;
			var tmp ="";
			for(var i=0;i<lines.length;i++){
				if(i==0){
					var indice = (twikismartTextareaContent.substring(0,twikismartStartIndex)).lastIndexOf("\n");
					if(indice == -1){
						indice = 0;
					}
					lines[i] = twikismartTextareaContent.substring(indice,twikismartStartIndex)+lines[i];
					twikismartStartIndex = indice;
				}
				if(contains == -2){ // Initialize this variable just one time
					contains = twikismartContainsNumBullet(lines); // added ... 
				}
				if(lines[i].length != 0 && !(lines[i].length == 1 && lines[i].indexOf("\n") == 0)){
					if(i==0 && lines[i].indexOf("\n") == -1){
						if(contains == 0){
							// Delete bullet
							var theindex = lines[i].indexOf("   1 ");
							if(theindex != -1){
								lines[i] = twikismartDeleteBulletInto(lines[i]);
							}
						}
						else{
							if(contains == 1){
								//Search if there is a bullet -> if no add one 
								var containsBulletList = twikismartTextContainsBullet(lines[i]);
								if(containsBulletList){ // S'il y en a une, il faut l'enlever avant
									lines[i] = twikismartDeleteBulletInto(lines[i]);
								}
								if(!twikismartTextContainsNumBullet(lines[i])){
									var oldL = lines[i].length;
									lines[i] = twikismartInsertNumBulletInto(lines[i]);
								}
								// Else don't touch
							}
							else{
								// Insert a bullet
								var containsBulletList = twikismartTextContainsBullet(lines[i]);
								if(containsBulletList){ // S'il y en a une, il faut l'enlever avant
									lines[i] = twikismartDeleteBulletInto(lines[i]);
								}
								var oldL = lines[i].length;
								lines[i] = twikismartInsertNumBulletInto(lines[i]);
							}
						}	
					}
					else{
						if(!twikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
							if(contains == 0){
								// Delete bullet
								var theindex = lines[i].indexOf("   1 ");
								if(theindex != -1){
									lines[i] = lines[i].substring(0,theindex+3)+lines[i].substring(theindex+5,lines[i].length);
								}
							}
							else{
								if(contains == 1){
									//Search if there is a bullet -> if no add one
									var containsBulletList = twikismartTextContainsBullet(lines[i].substring(1,lines[i].length));
									if(containsBulletList){ // S'il y en a une, il faut l'enlever avant
										lines[i] = "\n"+twikismartDeleteBulletInto(lines[i].substring(1,lines[i].length));
									}									
									if(!twikismartTextContainsNumBullet(lines[i].substring(1,lines[i].length))){
										lines[i] = lines[i].substring(0,1)+twikismartInsertNumBulletInto(lines[i].substring(1,lines[i].length));
									}
								}
								else{
									// Insert a bullet
									var containsBulletList = twikismartTextContainsBullet(lines[i].substring(1,lines[i].length));
									if(containsBulletList){ // S'il y en a une, il faut l'enlever avant
										lines[i] = "\n"+twikismartDeleteBulletInto(lines[i].substring(1,lines[i].length));
									}
									lines[i] = lines[i].substring(0,1)+twikismartInsertNumBulletInto(lines[i].substring(1,lines[i].length));
								}
							}
						}
					}
				}
				tmp+=lines[i];
			}
			finaltext = tmp;
		}
		twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+finaltext+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	}
	// After copy/paste
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartStartIndex++;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex,twikismartStartIndex+finaltext.length-1);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
}

function twikismartInsertExlink(link, text){
	if(twikismartSelection.length == 0){
		twikismartSelection = "Your text";
	}
	var sfchar = twikismartIndexOfFirstCharacter(text);
	var sToAddBefore = "";
	var sToAddAfter = "";
	if(sfchar != 0 && sfchar != -1){
		text = text.substring(sfchar, text.length);
		for(var i=0;i<sfchar;i++){
			sToAddBefore = sToAddBefore+" ";
		}
	}
	else{
		sfchar = 0;
	}
	var slchar = twikismartIndexOfLastCharacter(text);
	if(slchar != 0 && slchar != -1){
		if(text.length != (slchar+1)){
			var bToAdd = text.length - (slchar+1);
			for(var i=0;i<bToAdd;i++){
				sToAddAfter = sToAddAfter+" ";
			}
		}
		text = text.substring(0, (slchar+1));
	}
	document.getElementById("smarteditorExternalLinkTextInput").value = "";
	twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+sToAddBefore+"[["+link+"]["+text+"]]"+sToAddAfter+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	twikismartTextarea.value = twikismartTextareaContent;
	
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+sToAddBefore.length,twikismartStartIndex+sToAddBefore.length+("[["+link+"]["+text+"]]").length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
}

function twikismartInsertExlinkButInit(link, text){
	twikismartInitializeAllAttributes();
	text = twikismartSelection;
	if(twikismartSelection.length == 0){
		twikismartSelection = "Your text";
	}
	var sfchar = twikismartIndexOfFirstCharacter(text);
	var sToAddBefore = "";
	var sToAddAfter = "";
	if(sfchar != 0 && sfchar != -1){
		text = text.substring(sfchar, text.length);
		for(var i=0;i<sfchar;i++){
			sToAddBefore = sToAddBefore+" ";
		}
	}
	else{
		sfchar = 0;
	}
	var slchar = twikismartIndexOfLastCharacter(text);
	if(slchar != 0 && slchar != -1){
		if(text.length != (slchar+1)){
			var bToAdd = text.length - (slchar+1);
			for(var i=0;i<bToAdd;i++){
				sToAddAfter = sToAddAfter+" ";
			}
		}
		text = text.substring(0, (slchar+1));
	}
	twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+sToAddBefore+"[["+link+"]["+text+"]]"+sToAddAfter+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	twikismartTextarea.value = twikismartTextareaContent;
	
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+sToAddBefore.length,twikismartStartIndex+sToAddBefore.length+("[["+link+"]["+text+"]]").length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
}

function twikismartIndent(){
	twikismartInitializeAllAttributes();
	var lines = twikismartGetLines(twikismartSelection);
	var finaltext = "";
	var tmp = "";
	
	if(twikismartSelection.length == 0){
		var indice = (twikismartTextareaContent.substring(0,twikismartStartIndex)).lastIndexOf("\n");
		twikismartTextareaContent = twikismartTextareaContent.substring(0,indice+1)+"   "+twikismartTextareaContent.substring(indice+1,twikismartTextareaContent.length);
	}
	else{
		if(lines != null && lines.length > 0){
			for(var i=0;i<lines.length;i++){
				if(i==0){
					var indice = (twikismartTextareaContent.substring(0,twikismartStartIndex)).lastIndexOf("\n");
					if(indice == -1){
						indice = 0;
					}
					lines[i] = twikismartTextareaContent.substring(indice,twikismartStartIndex)+lines[i];
					twikismartStartIndex = indice;
				}
				if(lines[i].length != 0 && !(lines[i].length == 1 && lines[i].indexOf("\n") == 0)){
					if(i==0 && lines[i].indexOf("\n") == -1){
						tmp+="   "+lines[i];
						
					}
					else{
						if(!twikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
							tmp+=lines[i].substring(0,1)+"   "+lines[i].substring(1,lines[i].length);
							
						}
						else{
							tmp+=lines[i];
						}
					}
				}
				else{
					tmp+=lines[i];
				}
			}
			finaltext = tmp;
		}
		twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+finaltext+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	}
	// Selection
	twikismartTextarea.value = twikismartTextareaContent;
	var tsleft = twikismartStartIndex+1;
	var tsright = twikismartStartIndex+finaltext.length;
	if(twikismartSelection.length == 0){
		tsleft = twikismartStartIndex+3;
		tsright = tsleft;
	}
	twikismartSetSelectionRange(twikismartTextarea,tsleft,tsright);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
}

function twikismartOutdent(){
	twikismartInitializeAllAttributes();
	var lines = twikismartGetLines(twikismartSelection);
	var finaltext = "";
	var tmp = "";
	var tsdeleted = false;
	if(twikismartSelection.length == 0){
		var indice = (twikismartTextareaContent.substring(0,twikismartStartIndex)).lastIndexOf("\n");
		var indiceFin = (twikismartTextareaContent.substring(twikismartStartIndex,twikismartTextareaContent.length)).indexOf("\n");
		if(indiceFin == -1){
			indiceFin = twikismartTextareaContent.length;
		}
		else{
			indiceFin+=twikismartStartIndex;
		}
		var lineToTest = twikismartTextareaContent.substring(indice+1,indiceFin);
		if(twikismartIndexOfBullet(lineToTest) != 0){
			if(((lineToTest.length > 5) && twikismartListToDelete) || (!twikismartListToDelete) ){
					if(twikismartTextareaContent.substring(indice+1,twikismartTextareaContent.length).indexOf("   ") == 0){
						twikismartTextareaContent = twikismartTextareaContent.substring(0,indice+1)+twikismartTextareaContent.substring(indice+4,twikismartTextareaContent.length);
					tsdeleted = true;
					}
				else{
					
				}
			}	
		}
	}
	else{
		if(lines != null && lines.length > 0){
			for(var i=0;i<lines.length;i++){
				if(i==0){
					var indice = (twikismartTextareaContent.substring(0,twikismartStartIndex)).lastIndexOf("\n");
					if(indice == -1){
						indice = 0;
					}
					lines[i] = twikismartTextareaContent.substring(indice,twikismartStartIndex)+lines[i];
					twikismartStartIndex = indice;
				}
				
				if(lines[i].length != 0 && !(lines[i].length == 1 && lines[i].indexOf("\n") == 0)){
					if(i==0 && lines[i].indexOf("\n") == -1){
						if(twikismartIndexOfBullet(lines[i]) != 0){ // Added
							if(((lines[i].length > 5) && twikismartListToDelete) || (!twikismartListToDelete) ){ // Added
								if(lines[i].indexOf("   ") == 0){
									lines[i] = lines[i].substring(3,lines[i].length);
								}
							}
						}
						tmp+=lines[i];
					}
					else{
						if(!twikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
							if(twikismartIndexOfBullet(lines[i].substring(1,lines[i].length)) != 0){ // Added
								if(((lines[i].substring(1,lines[i].length).length > 5) && twikismartListToDelete) || (!twikismartListToDelete) ){
									if(lines[i].indexOf("   ") == 1){
										lines[i] = lines[i].substring(0,1)+lines[i].substring(4,lines[i].length);
									}
								}
							}
							tmp+=lines[i];
						}
						else{
							tmp+=lines[i];
						}
					}
				}
				else{
					tmp+=lines[i];
				}
			}
			finaltext = tmp;
		}
		twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+finaltext+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	}
	twikismartTextarea.value = twikismartTextareaContent;
	var tsleft = twikismartStartIndex+1;
	var tsright = twikismartStartIndex+finaltext.length;
	if(twikismartSelection.length == 0 && tsdeleted){
		tsleft = twikismartStartIndex-3;
		tsright = tsleft;
	}
	twikismartSetSelectionRange(twikismartTextarea,tsleft,tsright);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
}


function twikismartOutdent2(){
	var lines = twikismartGetLines(twikismartSelection);
	var finaltext = "";
	var tmp = "";
	var tsdeleted = false;
	if(twikismartSelection.length == 0){
		var indice = (twikismartTextareaContent.substring(0,twikismartStartIndex)).lastIndexOf("\n");
		var indiceFin = (twikismartTextareaContent.substring(twikismartStartIndex,twikismartTextareaContent.length)).indexOf("\n");
		if(indiceFin == -1){
			indiceFin = twikismartTextareaContent.length;
		}
		else{
			indiceFin+=twikismartStartIndex;
		}
		var lineToTest = twikismartTextareaContent.substring(indice+1,indiceFin);
		if(twikismartIndexOfBullet(lineToTest) != 0){
			if(((lineToTest.length > 5) && twikismartListToDelete) || (!twikismartListToDelete) ){
					if(twikismartTextareaContent.substring(indice+1,twikismartTextareaContent.length).indexOf("   ") == 0){
						twikismartTextareaContent = twikismartTextareaContent.substring(0,indice+1)+twikismartTextareaContent.substring(indice+4,twikismartTextareaContent.length);
					tsdeleted = true;
					}
				else{
					
				}
			}	
		}
	}
	else{
		if(lines != null && lines.length > 0){
			for(var i=0;i<lines.length;i++){
				if(i==0){
					var indice = (twikismartTextareaContent.substring(0,twikismartStartIndex)).lastIndexOf("\n");
					if(indice == -1){
						indice = 0;
					}
					lines[i] = twikismartTextareaContent.substring(indice,twikismartStartIndex)+lines[i];
					twikismartStartIndex = indice;
				}
				
				if(lines[i].length != 0 && !(lines[i].length == 1 && lines[i].indexOf("\n") == 0)){
					if(i==0 && lines[i].indexOf("\n") == -1){
						if(twikismartIndexOfBullet(lines[i]) != 0){ // Added
							if(((lines[i].length > 5) && twikismartListToDelete) || (!twikismartListToDelete) ){ // Added
								if(lines[i].indexOf("   ") == 0){
									lines[i] = lines[i].substring(3,lines[i].length);
								}
							}
						}
						tmp+=lines[i];
					}
					else{
						if(!twikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
							if(twikismartIndexOfBullet(lines[i].substring(1,lines[i].length)) != 0){ // Added
								if(((lines[i].substring(1,lines[i].length).length > 5) && twikismartListToDelete) || (!twikismartListToDelete) ){
									if(lines[i].indexOf("   ") == 1){
										lines[i] = lines[i].substring(0,1)+lines[i].substring(4,lines[i].length);
									}
								}
							}
							tmp+=lines[i];
						}
						else{
							tmp+=lines[i];
						}
					}
				}
				else{
					tmp+=lines[i];
				}
			}
			finaltext = tmp;
		}
		twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+finaltext+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	}
	twikismartTextarea.value = twikismartTextareaContent;
	var tsleft = twikismartStartIndex+1;
	var tsright = twikismartStartIndex+finaltext.length;
	if(twikismartSelection.length == 0 && tsdeleted){
		tsleft = twikismartStartIndex-3;
		tsright = tsleft;
	}
	twikismartSetSelectionRange(twikismartTextarea,tsleft,tsright);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
}


function twikismartNop(){
	twikismartInitializeAllAttributes();
	twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+"<nop>"+twikismartSelection+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+"<nop>".length,twikismartStartIndex+"<nop>".length+twikismartSelection.length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
}

// You must have an item with the id twikismartsig containing page signature - change it in your edit template file
function twikismartSign(){
	twikismartInitializeAllAttributes();
	var sign = document.getElementById("sig");
	if(sign != null){
		twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+sign.value+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	}
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex,twikismartStartIndex+sign.value.length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}

}

function twikismartInsertGMTDate(){
	twikismartInitializeAllAttributes();
	var date = new Date();
	twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+date.toGMTString()+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex,twikismartStartIndex+date.toGMTString().length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}

}

function twikismartInsertSimpleTOC(){
	twikismartInitializeAllAttributes();
	var twikismartTOC = "%TOC%";
	twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+twikismartTOC+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex,twikismartStartIndex+twikismartTOC.length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}

}

function twikismartInsertSimpleTag(ttsTag){

		twikismartInitializeAllAttributes();

	var twikismartTag = ttsTag;

	twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+twikismartTag+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex,twikismartStartIndex+twikismartTag.length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}

}

function twikismartInsertSimpleTagButNotInit(ttsTag){

	var twikismartTag = ttsTag;

	twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+twikismartTag+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex,twikismartStartIndex+twikismartTag.length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}

}

function twikismartInsertSimpleTagAndNoSelect(ttsTag){
	twikismartInitializeAllAttributes();
	var twikismartTag = ttsTag;
	twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+twikismartTag+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+twikismartTag.length,twikismartStartIndex+twikismartTag.length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
}

function twikismartInsertHRTag(){
	twikismartInitializeAllAttributes();
	var twikismartTag = "---";
	var tsindbefore = twikismartTextareaContent.substring(0,twikismartStartIndex).lastIndexOf("\n");
	if(!twikismartIsEmptyString(twikismartTextareaContent.substring(tsindbefore+1,twikismartStartIndex))){
		twikismartTag = "\n"+twikismartTag;
	}
	else{
		twikismartStartIndex = tsindbefore+1;
	}
	var tsindafter = twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length).indexOf("\n");
	if(tsindafter == -1){
		tsindafter = twikismartTextareaContent.length-1;
	}
	else{
		tsindafter+=twikismartEndIndex;
	}
	if(!twikismartIsEmptyString(twikismartTextareaContent.substring(twikismartEndIndex,tsindafter))){
		twikismartTag = twikismartTag+"\n";
	}	
	twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+twikismartTag+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex,twikismartStartIndex+twikismartTag.length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}

}

// Increase textarea rows value
function twikismartIncreaseSize(){
	twikismartTextarea.rows = twikismartTextarea.rows+1;
	twikismartTextAreaRows = twikismartTextarea.rows;

}

// Decrease textarea rows value
function twikismartDecreaseSize(){
	if(twikismartTextarea.rows-1 > 0){
		twikismartTextarea.rows = twikismartTextarea.rows-1;
		twikismartTextAreaRows = twikismartTextarea.rows;	
	}
}

// Adjust textarea rows value to lines
function twikismartAdjustSize(){
	if(!twikismartEngineAction){
		twikismartEngineAction = true;
		if(twikismartTextarea.rows == twikismartTextAreaRows){
			twikismartInitializeAllAttributes();
			var cursorbefore = twikismartStartIndex;
			var cursorafter = twikismartEndIndex;
			twikismartSetSelectionRange(twikismartTextarea,0,twikismartTextarea.value.length);
			twikismartInitializeAllAttributes();
			var twikismartnblines = twikismartGetLines(twikismartTextareaContent).length;
			twikismartTextarea.rows = twikismartnblines;
			twikismartTextarea.value = twikismartTextareaContent;
			twikismartAdjustActivated = true;
			twikismartSetSelectionRange(twikismartTextarea,cursorbefore,cursorafter);
		}
		else{
			twikismartInitializeAllAttributes();
			twikismartTextarea.rows = twikismartTextAreaRows;
			twikismartAdjustActivated = false;
			twikismartTextarea.value = twikismartTextareaContent;
			twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex,twikismartEndIndex);
		}
		twikismartEngineAction = false;
	}
}

function twikismartAutoAdjust(){
	if(twikismartAdjustActivated){
		twikismartInitializeAllAttributes();
		var cursorbefore = twikismartStartIndex;
		var cursorafter = twikismartEndIndex;
		twikismartSetSelectionRange(twikismartTextarea,0,twikismartTextarea.value.length);
		twikismartInitializeAllAttributes();
		var twikismartnblines = twikismartGetLines(twikismartTextareaContent).length;
		twikismartTextarea.rows = twikismartnblines;
		twikismartTextarea.value = twikismartTextareaContent;
		twikismartAdjustActivated = true;
		twikismartSetSelectionRange(twikismartTextarea,cursorbefore,cursorafter);
	}
}

function twikismartInsertHeading(twikismartLine, twikismartHeadingValue, multiline){
	if(twikismartLine != null && twikismartHeadingValue != null){
		var containsHd = -2;
		var tsindex = 0; // If the line begin with \n, we have to test string without \n
		var teststartindice = twikismartLine.indexOf("\n");
		if(teststartindice == 0){
			tsindex = 1;
		}
		containsHd = twikismartContainsHeading(twikismartLine.substring(tsindex,twikismartLine.length));

		if(containsHd != -1){ // Si la ligne contient un heading, alors il faut le remplacer par celui qui est demandé
			var tsendline = twikismartLine.substring((tsindex+containsHd+3),twikismartLine.length);
			var tsindexOf = twikismartIndexOfFirstCharacter(tsendline);
			if(tsindexOf != -1){
				tsendline = tsendline.substring(tsindexOf,tsendline.length);
			}
			twikismartLine = twikismartLine.substring(0,tsindex)+twikismartHeadingValue+tsendline;
		}
		else{ // Sinon, il suffit de le rajouter
			if((!twikismartIsEmptyString(twikismartLine.substring(tsindex,twikismartLine.length))) || (!multiline)){
				var tsendline = twikismartLine.substring(tsindex,twikismartLine.length);
				var tsindexOf = twikismartIndexOfFirstCharacter(tsendline);
				if(tsindexOf != -1){
					tsendline = tsendline.substring(tsindexOf,tsendline.length);
				}
				twikismartLine = twikismartLine.substring(0,tsindex)+twikismartHeadingValue+tsendline;
			}
		}
	}
	return twikismartLine;
}

// Donner une ligne avec (a l'indice 0)  ou sans retour chariot
function smarteditNormalStyleIntoLine(twikismartLine){
	if(twikismartLine != null && twikismartLine.length > 0){
		var containsHd = -2;
		var tsindex = 0; // If the line begin with \n, we have to test string without \n
		var teststartindice = twikismartLine.indexOf("\n");
		if(teststartindice == 0){
			tsindex = 1;
		}
		containsHd = twikismartContainsHeading(twikismartLine.substring(tsindex,twikismartLine.length));
		if(containsHd != -1){ // Si la ligne contient un heading, alors il faut le remplacer par celui qui est demandé
			twikismartLine = twikismartLine.substring(0,tsindex)+twikismartLine.substring((tsindex+containsHd+3),twikismartLine.length);
			var tsfirstchar = twikismartIndexOfFirstCharacter(twikismartLine.substring(tsindex,twikismartLine.length));
			if(tsfirstchar != -1){
				twikismartLine = twikismartLine.substring(0,tsindex)+twikismartLine.substring(tsfirstchar,twikismartLine.length);
			}
		}
	}
	return twikismartLine;
}

function twikismartFormatText(tagvalue){

	var lines = twikismartGetLines(twikismartSelection);
	var tsselectstart = twikismartStartIndex;
	var tsselectend = twikismartEndIndex;
	finaltext = "";
	var tmp = "";
	
	if(twikismartSelection.length == 0){ // Si la selection est nulle, on recupere la ligne (en entier)  ou se trouve le curseur pour la traiter
		var stringBefore = twikismartTextareaContent.substring(0,twikismartStartIndex);
		var stringAfter = twikismartTextareaContent.substring(twikismartStartIndex,twikismartTextareaContent.length);
		var startIndice = stringBefore.lastIndexOf("\n");
		if(startIndice == -1){ // Si on en trouve pas, c'est que l'on est sur la première ligne
			startIndice = 0;
		}
		
		var endIndice = stringAfter.indexOf("\n");
		if(endIndice == -1){ // Si on en trouve pas, c'est que l'on est sur la dernière ligne
			endIndice = twikismartTextareaContent.length;
		}
		if(endIndice != twikismartTextareaContent.length){
			endIndice+=twikismartStartIndex;
		}
		var tscurrentline = twikismartTextareaContent.substring(startIndice,endIndice);
		tscurrentline = twikismartInsertHeading(tscurrentline, tagvalue, false);
		twikismartTextareaContent = twikismartTextareaContent.substring(0,startIndice)+tscurrentline+twikismartTextareaContent.substring(endIndice,twikismartTextareaContent.length);
		tsselectstart = startIndice+tscurrentline.length;
		tsselectend = tsselectstart;
	}
	else{ // Si la sélection n'est pas vide, il faut bien sur récupérer toutes les lignes et les traiter
		var tsfinaltext = "";
		if(lines != null && lines.length > 0){
		
			// Récupération de la première ligne en entier
			var stringBefore = twikismartTextareaContent.substring(0,twikismartStartIndex);
			var startIndice = stringBefore.lastIndexOf("\n");
			if(startIndice == -1){
				startIndice = 0;
			}
			lines[0] = stringBefore.substring(startIndice,twikismartStartIndex)+lines[0];
			
			// Récupération de la dernière ligne en entier
			var stringAfter = twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
			var endIndice = stringAfter.indexOf("\n");
			if(endIndice == -1){
				endIndice=twikismartTextareaContent.length;
			}
			if(endIndice != twikismartTextareaContent.length){
				endIndice+=twikismartEndIndex;
			}
			lines[lines.length-1] = lines[lines.length-1]+twikismartTextareaContent.substring(twikismartEndIndex,endIndice);
			for(var i=0;i<lines.length;i++){
				tsfinaltext += twikismartInsertHeading(lines[i], tagvalue, true);
			}
			twikismartTextareaContent = twikismartTextareaContent.substring(0,startIndice)+tsfinaltext+twikismartTextareaContent.substring(endIndice,twikismartTextareaContent.length);
			tsselectstart = startIndice+tagvalue.length;
			tsselectend = tsselectstart+tsfinaltext.length-tagvalue.length;
		}
	}
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,tsselectstart,tsselectend);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
}

function twikismartNormalizeFormat(){
	
	var lines = twikismartGetLines(twikismartSelection);
	var tsselectstart = twikismartStartIndex;
	var tsselectend = twikismartEndIndex;
	finaltext = "";
	var tmp = "";
	
	if(twikismartSelection.length == 0){ // Si la selection est nulle, on recupere la ligne (en entier)  ou se trouve le curseur pour la traiter
		var stringBefore = twikismartTextareaContent.substring(0,twikismartStartIndex);
		var stringAfter = twikismartTextareaContent.substring(twikismartStartIndex,twikismartTextareaContent.length);
		var startIndice = stringBefore.lastIndexOf("\n");
		if(startIndice == -1){ // Si on en trouve pas, c'est que l'on est sur la première ligne
			startIndice = 0;
		}
		
		var endIndice = stringAfter.indexOf("\n");
		if(endIndice == -1){ // Si on en trouve pas, c'est que l'on est sur la dernière ligne
			endIndice = twikismartTextareaContent.length;
		}
		if(endIndice != twikismartTextareaContent.length){
			endIndice+=twikismartStartIndex;
		}
		var tscurrentline = twikismartTextareaContent.substring(startIndice,endIndice);
		tscurrentline = smarteditNormalStyleIntoLine(tscurrentline);
		twikismartTextareaContent = twikismartTextareaContent.substring(0,startIndice)+tscurrentline+twikismartTextareaContent.substring(endIndice,twikismartTextareaContent.length);
		tsselectstart = startIndice+1;
		tsselectend = tsselectstart;
	}
	else{ // Si la sélection n'est pas vide, il faut bien sur récupérer toutes les lignes et les traiter
		var tsfinaltext = "";
		if(lines != null && lines.length > 0){
		
			// Récupération de la première ligne en entier
			var stringBefore = twikismartTextareaContent.substring(0,twikismartStartIndex);
			var startIndice = stringBefore.lastIndexOf("\n");
			if(startIndice == -1){
				startIndice = 0;
			}
			lines[0] = stringBefore.substring(startIndice,twikismartStartIndex)+lines[0];
			
			// Récupération de la dernière ligne en entier
			var stringAfter = twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
			var endIndice = stringAfter.indexOf("\n");
			if(endIndice == -1){
				endIndice=twikismartTextareaContent.length;
			}
			if(endIndice != twikismartTextareaContent.length){
				endIndice+=twikismartEndIndex;
			}
			lines[lines.length-1] = lines[lines.length-1]+twikismartTextareaContent.substring(twikismartEndIndex,endIndice);
			for(var i=0;i<lines.length;i++){
				tsfinaltext += smarteditNormalStyleIntoLine(lines[i]);
			}
			twikismartTextareaContent = twikismartTextareaContent.substring(0,startIndice)+tsfinaltext+twikismartTextareaContent.substring(endIndice,twikismartTextareaContent.length);
			tsselectstart = startIndice+1;
			tsselectend = tsselectstart+tsfinaltext.length;
		}
	}
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,tsselectstart,tsselectend);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
}

function twikismartVerbatim(){
	
	var tstoadd = "\n<verbatim>\n"+twikismartSelection+"\n</verbatim>\n";
	
	twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+tstoadd+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+12,twikismartStartIndex+12+twikismartSelection.length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
	
}

function twikismartBlockquote(){
	
	var tstoadd = "\n<blockquote>\n"+twikismartSelection+"\n</blockquote>\n";
	
	twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+tstoadd+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+14,twikismartStartIndex+14+twikismartSelection.length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
	
}

function twikismartInsertParapraph(){
	twikismartInitializeAllAttributes();
	var tstoadd = "\n"+twikismartSelection;
	
	twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+tstoadd+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+1,twikismartStartIndex+tstoadd.length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
	
}

// This function is called when the return key is pressed
// Automatic indentation - Automatic detection of bullet in previous line
function twikismartReturnKeyAction(){
	twikismartInitializeAllAttributes();
	var smartKeyAct = false;
	if(twikismartShiftPressed){
		twikismartListToInsert = false;
		twikismartListToDelete = false;
	}
	if(twikismartListToInsert){
		smartKeyAct = true;
		twikismartListToInsert = false;
		twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartEndIndex)+twikismartListType+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
		twikismartEndIndex+=twikismartListType.length;
		twikismartStartIndex+=twikismartListType.length;
		twikismartListType = "";
	}
	if(twikismartListToDelete){
		twikismartListToDelete = false;
		smartKeyAct = true;
		var toreplace = twikismartTextareaContent.substring(0,twikismartEndIndex);

		var i = toreplace.lastIndexOf("\n");
		if(i == -1){
			i=0;
		}
		
		
		var tsreplace = toreplace.substring(0,i);
		var tslastIndex = tsreplace.lastIndexOf("\n");
		if(tslastIndex == -1){
			tslastIndex = 0;
		}
		var tsStringToReplace = tsreplace.substring(0,tslastIndex+1);
		twikismartTextareaContent = tsStringToReplace+"\n"+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent
.length);
		twikismartStartIndex = tsStringToReplace.length+1;
	}
	if(twikismartSpaceToAdd && twikismartSpaceToAddText != null && twikismartSpaceToAddText.length > 0){
		smartKeyAct = true;
		twikismartSpaceToAdd = false;      
		twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartEndIndex)+twikismartSpaceToAddText+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
		twikismartEndIndex+=twikismartSpaceToAddText.length;
		twikismartStartIndex+=twikismartSpaceToAddText.length;
		twikismartSpaceToAddText = "";
	}
	if(navigator.userAgent.toLowerCase().indexOf("opera") == -1 || smartKeyAct){
		twikismartTextarea.value = twikismartTextareaContent;
		twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex,twikismartStartIndex);
	}
	if(is_firefox){
		 twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
}

function twikismartDetectListContext(){
	twikismartInitializeAllAttributes();
	var textBefore = twikismartTextareaContent.substring(0,twikismartStartIndex);
	var index = textBefore.lastIndexOf("\n");
	var currentLine = textBefore.substring(index+1,twikismartStartIndex);
	
	
	// Raccourci demandé par Sandra et Colas
	var listAdded = false;
	if(currentLine.indexOf("* ") == 0){
		currentLine = "   "+currentLine;
		twikismartTextareaContent = twikismartTextareaContent.substring(0,index+1)+currentLine+twikismartTextareaContent.substring(twikismartEndIndex, twikismartTextareaContent.length);
		twikismartTextarea.value = twikismartTextareaContent;
		var theNewIndex = (twikismartTextareaContent.substring(0,index+1).length)+(currentLine.length);
		twikismartSetSelectionRange(twikismartTextarea, theNewIndex, theNewIndex);
		listAdded = true;
	}
	var indexbullet = twikismartIndexOfBullet(currentLine);
	if(indexbullet >= 0){
		twikismartListToInsert = true;
	}
	
	if(((!listAdded && !twikismartListToInsert) || twikismartShiftPressed) && !twikismartListToDelete){ 
		// Si rien n'a été touché et que rien ne va etre ajouté, on peut maintenant regarder s'il faut ou non conserver une certaine indentation	
		var tsIndexOfChar = twikismartIndexOfFirstCharacter(currentLine);
		if(tsIndexOfChar != -1){
			
			if(!twikismartIsEmptyString(currentLine.substring(tsIndexOfChar, currentLine.length))){
				twikismartSpaceToAdd = true;
				twikismartSpaceToAddText = currentLine.substring(0,tsIndexOfChar);
				
			}
		}
	}

}

function twikismartSearchTextFromLeft(){
	if(twikismartTextToSearch != null && twikismartTextToSearch.length > 0){
		twikismartTextareaContent = twikismartTextarea.value;
		twikismartTextareaContent = twikismartReplaceAll(twikismartTextareaContent);
		twikismartTextareaContent = twikismartTextareaContent.toUpperCase();
		twikismartTextToSearch = twikismartTextToSearch.toUpperCase();
		var tsIndexOfFirst = twikismartTextOccurence;
		if(tsIndexOfFirst == -1){ // S'il n'y a pas encore d'occurence surlignée alors on cherche la première
			tsIndexOfFirst = twikismartTextareaContent.indexOf(twikismartTextToSearch);
			if(tsIndexOfFirst != -1){
				twikismartTextOccurence = tsIndexOfFirst;
			}
		}
		else{ // Sinon, on cherche a partir de l'ancien index + 1
			var tsIndexOfFirstBis = twikismartTextareaContent.substring(tsIndexOfFirst+1,twikismartTextareaContent.length).indexOf(twikismartTextToSearch);
			if(tsIndexOfFirstBis != -1){ // Initialisation de la valeur
				twikismartTextOccurence = tsIndexOfFirst+tsIndexOfFirstBis+1;
				// Il y avait une occurence avant .. on peut donc activer le bouton previous
				document.getElementById("smartEditSearchPreviousButton").className = "smarteditButtonTD"+smartEditorIECssClass;
				var theButton7 = document.getElementById("smartEditSearchPreviousButton");
				theButton7.onmouseover = function(){
					theButton7.className = "smarteditButtonTDPressed"+smartEditorIECssClass;
				};
				theButton7.onmouseout = function(){
					theButton7.className = "smarteditButtonTD"+smartEditorIECssClass;
				};
			}
		}
		// maintenant on teste si il y encore des elements apres pour pouvoir en informer l'utilisateur
		if(twikismartTextOccurence != -1){ // On regarde d'abord si une occurence a été trouvée
			// Si c'est le cas, on peut alors chercher plus loin
			var tsIndexOfFirstInfo = twikismartTextareaContent.substring(twikismartTextOccurence+1,twikismartTextareaContent.length).indexOf(twikismartTextToSearch);
			if(tsIndexOfFirstInfo != -1){
				// Ce n'est pas le dernier, pas besoin de griser le bouton
				document.getElementById("smartEditSearchInfoTD").innerHTML = "";
			}
			else{
				// Sinon, c'est le dernier élément ... il faut donc griser le bouton next et indiquer l'info à l'utilisateur
				var imginfo = "<img src=\""+twikismartScriptURL+"info.gif\">";
				
				document.getElementById("smartEditSearchNextButton").className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
				var theButton = document.getElementById("smartEditSearchNextButton");
				theButton.onmouseover = function(){
					theButton.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
				};
				theButton.onmouseout = function(){
					theButton.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
				};
			}
		}
	}
	else{
		twikismartTextOccurence = -1;
	}
}

function twikismartSearchTextFromRight(){
	if(twikismartTextToSearch != null && twikismartTextToSearch.length > 0){
		twikismartTextareaContent = twikismartTextarea.value;
		twikismartTextareaContent = twikismartReplaceAll(twikismartTextareaContent);
		twikismartTextareaContent = twikismartTextareaContent.toUpperCase();
		twikismartTextToSearch = twikismartTextToSearch.toUpperCase();
		var tsIndexOfFirst = twikismartTextOccurence;
		if(tsIndexOfFirst == -1){
			tsIndexOfFirst = twikismartTextareaContent.lastIndexOf(twikismartTextToSearch);
			if(tsIndexOfFirst != -1){
				twikismartTextOccurence = tsIndexOfFirst;
			}
		}
		else{
			tsIndexOfFirst = twikismartTextareaContent.substring(0,tsIndexOfFirst).lastIndexOf(twikismartTextToSearch);
			if(tsIndexOfFirst != -1){
				twikismartTextOccurence = tsIndexOfFirst;
			}
		}
		// On regarde s'il y a encore un élément avant celui que l'on vient de trouver....
		// Si c'est le cas, on peut laisser les 2 boutons activés
		if(twikismartTextOccurence != -1){ // Il faut au moins qu'un élément existe pour voir s'il y en a un avant !
			tsIndexOfFirstInfo = twikismartTextareaContent.substring(0,twikismartTextOccurence).lastIndexOf(twikismartTextToSearch);
			if(tsIndexOfFirstInfo != -1){
				document.getElementById("smartEditSearchNextButton").className = "smarteditButtonTD"+smartEditorIECssClass;
				var theButton = document.getElementById("smartEditSearchNextButton");
				theButton.onmouseover = function(){
					theButton.className = "smarteditButtonTDPressed"+smartEditorIECssClass;
				};
				theButton.onmouseout = function(){
					theButton.className = "smarteditButtonTD"+smartEditorIECssClass;
				};
				
				document.getElementById("smartEditSearchPreviousButton").className = "smarteditButtonTD"+smartEditorIECssClass;
				var theButton2 = document.getElementById("smartEditSearchPreviousButton");
				theButton2.onmouseover = function(){
					theButton2.className = "smarteditButtonTDPressed"+smartEditorIECssClass;
				};
				theButton2.onmouseout = function(){
					theButton2.className = "smarteditButtonTD"+smartEditorIECssClass;
				};
				
				
				document.getElementById("smartEditSearchInfoTD").innerHTML = "";
			}
			else{ // Sinon, on se trouve sur le premier élément, il faut donc désactiver le bouton previous 
				document.getElementById("smartEditSearchPreviousButton").className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
				var theButton2 = document.getElementById("smartEditSearchPreviousButton");
				theButton2.onmouseover = function(){
					theButton2.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
				};
				theButton2.onmouseout = function(){
					theButton2.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
				};
				
				document.getElementById("smartEditSearchNextButton").className = "smarteditButtonTD"+smartEditorIECssClass;
				var theButton = document.getElementById("smartEditSearchNextButton");
				theButton.onmouseover = function(){
					theButton.className = "smarteditButtonTDPressed"+smartEditorIECssClass;
				};
				theButton.onmouseout = function(){
					theButton.className = "smarteditButtonTD"+smartEditorIECssClass;
				};

			}
		}
	}
	else{
		twikismartTextOccurence = -1;
	}
}

function twikismartHighLightNextOccurenceFromTop(){
	twikismartSearchTextFromLeft();
	if(twikismartTextOccurence != -1 && twikismartTextToSearch != null && twikismartTextToSearch.length > 0){
		twikismartSetSelectionRange(twikismartTextarea,twikismartTextOccurence,twikismartTextOccurence+twikismartTextToSearch.length);
		if(is_firefox){
			var scrH = twikismartCalculateScroll();
			var nblbefore = twikismartGetLines(twikismartTextareaContent.substring(0,twikismartTextOccurence)).length;
			nblbefore = nblbefore+5;
			if(nblbefore > twikismartTextarea.rows){
				nblbefore = nblbefore-(twikismartTextarea.rows);
			}
			else{
				nblbefore = 0;
			}
			twikismartTextarea.scrollTop = (scrH*nblbefore);
		}
	}
}

function twikismartHighLightNextOccurenceFromBottom(){
	twikismartSearchTextFromRight(); 
	if(twikismartTextOccurence != -1 && twikismartTextToSearch != null && twikismartTextToSearch.length > 0){
		twikismartSetSelectionRange(twikismartTextarea,twikismartTextOccurence,twikismartTextOccurence+twikismartTextToSearch.length);
		if(is_firefox){
			var scrH = twikismartCalculateScroll();
			var nblbefore = twikismartGetLines(twikismartTextareaContent.substring(0,twikismartTextOccurence)).length;
			nblbefore = nblbefore+5;
			if(nblbefore > twikismartTextarea.rows){
				nblbefore = nblbefore-(twikismartTextarea.rows);
			}
			else{
				nblbefore = 0;
			}
			twikismartTextarea.scrollTop = (scrH*nblbefore);
		}
	}
}

function smartEditorInsertWikiLink(){
	smartEditPopup = open(twikismartScriptURL+"html/index.html",'popup','width=570,height=430,toolbar=no,scrollbars=no,resizable=yes');
	smartEditPopup.document.close();
}


function twikismartInsertSmartColor(smartColor){
	
	var sstagBeg = "<span class=\""+smartColor+"\">";
	var sstagEnd = "</span>";
	var tstoadd = sstagBeg+twikismartSelection+sstagEnd;
	
	
	
	twikismartTextareaContent = twikismartTextareaContent.substring(0,twikismartStartIndex)+tstoadd+twikismartTextareaContent.substring(twikismartEndIndex,twikismartTextareaContent.length);
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex+sstagBeg.length,twikismartStartIndex+sstagBeg.length+twikismartSelection.length);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
	
}

function twikismartSelectEntireLine(){
	twikismartInitializeAllAttributes();
	var selectLineBegin = (twikismartTextareaContent.substring(0,twikismartStartIndex)).lastIndexOf("\n");
	selectLineBegin+=1;// Ne pas prendre le \n trouvé et si c'est = à -1 ... alors le premier caractere est automatiquement le premier de la textarea
	var selectLineEnd = (twikismartTextareaContent.substring(selectLineBegin,twikismartTextareaContent.length)).indexOf("\n");
	if(selectLineEnd == -1){
		selectLineEnd = twikismartTextareaContent.length;
	}
	else{
		selectLineEnd = selectLineBegin+selectLineEnd;
	}
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,selectLineBegin,selectLineEnd);
	if(is_firefox){
		twikismartTextarea.scrollTop = twikismartTextareaScrollFirefox;
	}
	
	
}