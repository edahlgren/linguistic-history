
import csv

outfileName = "volume1-poster.tex"
outfile = file (outfileName, "w")
svgoutfileName = "volume1-poster.html"
svgoutfile = file(svgoutfileName, "w")


header=r"""
\documentclass[final, 12pt]{beamer}
%\usepackage[size=custom,width=200,height=107,scale=.5,orientation=portrait]{beamerposter}
%\usepackage[scale=1.24]{beamerposter} % Use the beamerposter package for laying out the poster
\usepackage[width=36in,scale=.5,orientation=landscape]{beamerposter}

\usepackage{pst-slpe}
\usepackage{pst-grad}
\usepackage{pst-node}
\usepackage{pst-blur}
 
\definecolor{teacher}{HTML}{0000FF}  
\definecolor{hostile}{HTML}{FF0000}  
\definecolor{influence}{HTML}{808080}  
\definecolor{colleagues}{RGB}{64 200 0}
\definecolor{other}{RGB}{255 255 255} 


\definecolor{anthropologist1}{HTML}{FFB3B3}  
\definecolor{anthropologist2}{HTML}{FFE6E6}
\definecolor{anthropologist3}{HTML}{CCCC00}
 
\definecolor{linguist1}{HTML}{DBA909}  
\definecolor{linguist2}{HTML}{F8EDCB} % EDBB99
\definecolor{linguist3}{HTML}{533419}
\definecolor{linguist-line}{HTML}{D2691E}

\definecolor{linguist-fill2}{RGB}{255 255 0}
\definecolor{linguist-fill3}{RGB}{255 255 0}
\definecolor{linguist-fill4}{RGB}{255 255 0}
 
\definecolor{philosopher1}{HTML}{66FF66} 
\definecolor{philosopher2}{HTML}{EBFCF3}
\definecolor{philosopher3}{HTML}{00FF00} 
 

\definecolor{psychologist1}{HTML}{00FFFF}
\definecolor{psychologist2}{HTML}{EBFCF3} % aqua (BLUE)
\definecolor{psychologist3}{HTML}{269900}
\definecolor{psychologist-fill3}{HTML}{00FF00}
 
\definecolor{sociologist1}{HTML}{DDFF00}  
\definecolor{sociologist2}{HTML}{DDFFCC}
\definecolor{sociologist3}{HTML}{ACCC00}
\definecolor{sociologist-line}{HTML}{D2691E}

\definecolor{logician1}{HTML}{73AE9D}  
\definecolor{logician2}{HTML}{DDFFCC}
\definecolor{logician3}{HTML}{ACCC00}


 

\definecolor{linglog1}{HTML}{FF7F24} % for barhillel 
\definecolor{linglog2}{HTML}{FFE6E3}
\definecolor{linglog3}{HTML}{FF0000}
 
\definecolor{mathematician1}{HTML}{BCA9F5}  
\definecolor{mathematician2}{HTML}{E0ECF8}
\definecolor{mathematician3}{HTML}{0000FF}

 
\definecolor{other-fill}{HTML}{D3D3D3}  
 

  

%-----------------------------------------------------------
% Define the column widths and overall poster size
% To set effective sepwid, onecolwid and twocolwid values, first choose how many columns you want and how much separation you want between columns
% In this template, the separation width chosen is 0.024 of the paper width and a 4-column layout
% onecolwid should therefore be (1-(# of columns+1)*sepwid)/# of columns e.g. (1-(4+1)*0.024)/4 = 0.22
% Set twocolwid to be (2*onecolwid)+sepwid = 0.464
% Set threecolwid to be (3*onecolwid)+2*sepwid = 0.708
\setlength{\paperwidth}{54in} % A0 width: 46.8in
\setlength{\paperheight}{36in} % A0 height: 33.1in
 \setlength{\topmargin}{-0.5in} % Reduce the top margin size
\usepackage{graphicx}  % Required for including images
\usepackage{booktabs} % Top and bottom rules for tables 
\begin{document}
  
\begin{frame}[t] % The whole poster is enclosed in one beamer frame
 
\psset{xunit=1.6cm,yunit=.4cm,linewidth=3pt}
\psset{gradangle=135,gradmidpoint=0.5,framesep=6pt}  

\begin{pspicture}(-5, 80)(120, 240)
%\begin{pspicture}(-25, 80)(135, 240)
 

\psset{fillstyle=solid,fillcolor=linguist-fill4,framearc=0.5}
\psset{linecolor=linguist-line}
\psset{shadow=true}

\psframe(16.5,140)(21.5,154) % kazan school box
\psframe(18,162)(23,195)
\psframe(24,162)(28,200) % moscow circle
\psframe(29,170)(33,210)   % prague Circle
\rput(31,206 ){\psframebox[linecolor=black,fillcolor=linguist-fill2]{\Large Prague Linguistic Circle }}

\psframe[fillcolor=philosopher1](38,177)(49,195)   % vienna Circle
\psframe[fillcolor=philosopher1](33,135)(47,162)   % brentano circle
\psframe[fillcolor=philosopher1](33.5,176)(37,200)   % Polish logicians 

% Generations: ellipses
\psellipse[fillstyle=solid,shadow=true,blur=true](6.5,80)(6,14)  %1st ellipse
\psellipse(6.5,119)(7,12)  %2nd ellipse
\psellipse (6.5,147)(10,13)  %3rd ellipse
\psellipse[fillcolor=linguist-fill3,linestyle=solid](5,200)(10,20)  %sapir circle
\psellipse[fillcolor=psychologist-fill3,linestyle=solid](58,189)(6,12)  %gestalt circle
%\psellipse[fillcolor=psychologist-fill3,linestyle=solid](68,143)(4,25)  %wundt circle


%\psset{fillcolor=linguist2}

\rput(3.3,154 ){\psframebox[ framesep=10pt] { \Large Neogrammarians    }} 
\rput(5,160){\psframebox[ linecolor=linguist-line,framesep=10pt]{ \LARGE Third Generation   }}
\rput(2,112 ){\psframebox [linecolor=linguist-line,framesep=10pt]{ \LARGE Second Generation   }}
\rput(2,85 ){\psframebox[linecolor=linguist-line,framesep=10pt,shadow=false,shadowsize=1,blur=true]{ \LARGE First Generation   }}




\psframe[fillcolor=linguist-fill2,linestyle=none,framearc=0.5](14,212)(37,235)   % machine translation
\psframe[fillcolor=linguist-fill2,linestyle=none,framearc=0.5](20,201)(28,225)   % machine translation
\psframe[fillcolor=linguist-fill2,linestyle=none,framearc=0.5,shadow=false](27,212)(28.5,225)   % machine translation

\rput(32,230 ){\psframebox{\begin{tabular}{c}{\LARGE Machine translation  }  \end{tabular}}}      
      

\rput(2,220 ){\psframebox{\begin{tabular}{c}{\Large Sapir circle }  \end{tabular}}} 

\psset{linecolor=linguist-line}
\rput(19,165 ){\psframebox{\begin{tabular}{c}{\Large St Petersburg School }\\1900-1918 \end{tabular}}}
\rput(20,144 ){\psframebox{\begin{tabular}{c}{\Large Kazan School }\\1874-1883 \end{tabular}}}
\rput(25,165 ){\psframebox{\begin{tabular}{c}{\Large Moscow School }\\  \end{tabular}}}
%\rput(31,166 ){\psframebox{\begin{tabular}{c}{\Large Prague Circle }\\  \end{tabular}}}
\rput(48,187 ){\psframebox[linecolor=black,fillcolor=philosopher1]{\Large Vienna Circle }}
\rput(61,188 ){\psframebox[linecolor=black,fillcolor=psychologist1]{\Large Gestalt }}


%sociology

 
 
%\psellipse[shadow=true,fillstyle=solid](-15,120)(8,6)  %1st ellipse
%\psellipse[shadow=true,fillstyle=solid,rot=75](-16.5,202)(4.4,4.5)  % Columbia ellipse
%\psellipse[shadow=true,fillstyle=solid](-10.4,195)(3,10)  % Harvard ellipse
%\psellipse[shadow=true,fillstyle=solid](-15,160)(3,8)  % UChicago ellipse
%\psellipse[shadow=true,fillstyle=solid](-15,186)(3,4)  % bernard ogburn and chapin


\psset{shadow=false}

   

"""


 

footer = """
\end{pspicture}
\end{frame}
\end{document}

"""

lastName = "lastName"
thisKey = "thisKey"
firstName = "firstName"
thisKey  = "thisKey"
xcoor = "xcoor"        
born = "born"
died = "died"
myLineColor = "myLineColor"
myProfession = "myProfession"

angleA="angleA"
armA="armA"
offsetA="offsetA"
angleB="angleB"
armB="armB"
offsetB="offsetB"
fromNode = "fromNode"
toNode = "toNode"


class People:
        def __init__(self):
                self.peopleList = list()
        def addPerson(self, thisPerson):
                self.peopleList.append(thisPerson)
         
       
class Person:

      
        
        def __init__ (self, myFirstName, myLastName,myBirthYear,myDeathYear,x, profession="linguist", myKey= ""):
                #print myLastName
                self.data = dict()
                self.data[firstName] = myFirstName
                self.data[lastName] = myLastName
                self.data[thisKey] = myKey
                #print myLastName
                self.data[born] = int(myBirthYear)
                self.data[died] = myDeathYear
                if profession=="sociologist":
                        self.data[xcoor]=float  (x)-25
                elif profession=="psychologist":
                        self.data[xcoor] = float(x) +5
                else:
                        self.data[xcoor] = x
                self.data[thisKey] = myKey
                self.data[myProfession] = profession
               
class Links:
        def __init__(self):
                self.linkList = list()
        def addLink(self,thisLink):
                self.linkList.append(thisLink)

class Link:
        def __init__(self, fromPerson, toPerson, angle1,arm1,offset1,angle2,arm2,offset2,thisLineColor="teacher"):
                self.data=dict()
                self.data[fromNode] = fromPerson
                self.data[toNode] = toPerson
                self.data[angleA]=angle1
                self.data[armA]=arm1
                self.data[offsetA]=offset1
                self.data[angleB]=angle2
                self.data[armB]=arm2
                self.data[offsetB]=offset2
                self.data[myLineColor]= thisLineColor 

#print header
print >>outfile, header


myPeople = People()
myLinks = Links()

with open ('volume1-poster.csv', 'r') as infile:
        genealogies = csv.reader(infile)
        for row in genealogies:
                #if row[6]=="sociologist":
                #        continue##
		# print row
                if row[0]=="#":
                        continue
                elif row[0] == "P":
	                if len(row[7]) == 0:
        	                p = Person(row[1],row[2],row[3],row[4],row[5],row[6])
        	                myPeople.addPerson(p)
                	if len(row[7] ) >0 == 8:
                        	p = Person(row[1],row[2],row[3],row[4],row[5],row[6],row[7])
                        	myPeople.addPerson(p)

 
 
 

#svgFormat = "<rect x=\"{0}\" y=\"{1}\" width=\"50\" height = \"50\", style=\"fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)\" /> " 
svgFormat = "<rect x=\"{0}\" y=\"{1}\" width=\"50\" height = \"50\", style=\"fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)\" /> " 
print >>svgoutfile, """<!DOCTYPE html>
<html>
<body>"""
print >>svgoutfile, "<svg width=\"2500\" height = \"2000\" >"

print " hi" 
print >>outfile, "\\psset{fillstyle=gradient,gradmidpoint=.5,gradangle=45}" 
formatstring = "\\rput({0:>4},{1:<3}) {{\\rnode{{{2:13}}} {{\\psframebox[{3:25}]{{ \\begin{{tabular}}{{c}}   {4:>13} {5:<13} \\\\ {6}--{7} \\end{{tabular}} }} }} }} "
for person in myPeople.peopleList:    
	print person.data[lastName]
        if len(person.data[thisKey])  == 0:
                person.data[thisKey] = person.data[lastName]
        print person.data[lastName]
        ycoor = (person.data[born] - 1700)
        thisLastName = person.data[lastName]
        thisLastName =  "\LARGE{\\textsc{" + thisLastName + "} }"
        if person.data[myProfession]=="philosopher":
                color_string = "gradbegin=philosopher1,gradend=philosopher2,linecolor=philosopher3" 
        elif person.data[myProfession]=="psychologist":
                color_string = "gradbegin=psychologist1,gradend=psychologist2,linecolor=psychologist3" 
        elif person.data[myProfession]=="philpsych":
                color_string = "gradbegin=philosopher1,gradend=psychologist2,linecolor=psychologist3"
        elif  person.data[myProfession]=="sociologist":
                color_string = "gradbegin=sociologist1,gradend=sociologist2,linecolor=sociologist3"
        elif  person.data[myProfession] == "anthropologist":
                color_string = "gradbegin=anthropologist1, gradend=anthropologist2,linecolor=white"                
        elif  person.data[myProfession] == "mathematician":
                color_string = "gradbegin=mathematician1,gradend=mathematician2,linecolor=white"         
        elif  person.data[myProfession] == "logician":
                color_string = "gradbegin=logician1,gradend=logician2,linecolor=white"       
                print person.data         
        else:
                color_string = "gradbegin=linguist1,gradend=linguist2,linecolor=linguist3"       
 
        print >>outfile, formatstring.format(person.data[xcoor],ycoor, person.data[thisKey], color_string,person.data[firstName],thisLastName,person.data[born], person.data[died])
        print            formatstring.format(person.data[xcoor],ycoor, person.data[thisKey], color_string,person.data[firstName],thisLastName,person.data[born], person.data[died])
        
       
        svgOut = svgFormat.format(str(float(person.data[xcoor])*20.0), ycoor*7)
        print >>svgoutfile, svgOut


print >>svgoutfile, "</svg>" 
print >>svgoutfile, "</body>"
print >>svgoutfile, "</html>"  

angleA="angleA"
armA="armA"
offsetA="offsetA"
angleB="angleB"
armB="armB"
offsetB="offsetB"
 
 
 
 

print >>outfile, "\\psset{linearc=0.5,linecolor=teacher}"

print >>outfile, "\\psset{fillstyle=none}"


p = Link("Sorokin", "Merton",90,2,0,-90,4,0)
myLinks.addLink(p)

p = Link("Parsons", "Merton",90,0,0,-90,1,-1)
myLinks.addLink(p)

p = Link("Zeisel", "Lazarsfeld",0,0,0,180,1,0, "colleagues")
myLinks.addLink(p)

 

p = Link("Lazarsfeld", "Stouffer",0,0,0,180,0,0)
myLinks.addLink(p)

p = Link("Lazarsfeld", "Boudon",90,0,0,-90,1,-1)
myLinks.addLink(p)

p = Link("Lazarsfeld", "Coleman",90,0,.5,-90,1,-1)
myLinks.addLink(p)

p = Link("Dewey", "Chapin",90,0,0,-90,1,-1)
myLinks.addLink(p)

p = Link("charlottebuhler", "Lazarsfeld",90,0,0,-90,1,-1)
myLinks.addLink(p)

p = Link("charlottebuhler", "Lazarsfeld",90,0,0,-90,1,-1)
myLinks.addLink(p)

p = Link("Wundt", "GHMead",90,0,0,-90,1,-1)
myLinks.addLink(p)









p = Link("Herder", "Fichte",90,3,-.5,-90,4,0.5)
myLinks.addLink(p)


p = Link("Kant", "Fichte",90,3,-.5,-90,4,-0.5)
myLinks.addLink(p)

 

p = Link("Langfeld", "Allport",90,1,0,-90,5,0)
myLinks.addLink(p)

p = Link("Carnap", "Quine",90,3,0,-90,4,0)
myLinks.addLink(p)
 


p = Link("Cassirer", "Lewin",90,3,0,-90,4,0)
myLinks.addLink(p)


p = Link("Bopp", "Whitney",90,3,0,-90,4,.33)
myLinks.addLink(p)

p = Link("Curtius", "Whitney",180,1,0,-90,1,-.33)
myLinks.addLink(p)

p = Link("Lepsius", "Whitney",90,1,1,-90,3,0)
myLinks.addLink(p)

p = Link("Mueller", "Whitney", 180,0,0,-90,0,-.33)
myLinks.addLink(p)

p = Link("Whitney", "Harper", 90,2,.66,-90,4,0)
myLinks.addLink(p)

p = Link("Whitney", "MauriceBloomfield",90,0,0,180,3,0)
myLinks.addLink(p)


p = Link("Whitney", "Lanman", 90,1,-.33,-90,1,0)
myLinks.addLink(p)

p = Link("Whitney", "Buck", 90,1,.33,-90,1,0)
myLinks.addLink(p)


p = Link("Buck", "Bloomfield", 90,1,0,-90,5,0)
myLinks.addLink(p)

p = Link("Baudouin", "Saussure", 90,1,.66,-90,.5,-.33,"influence")
myLinks.addLink(p)

p = Link("Baudouin", "Polivanov", 90,1,.33,-90,2,0)
myLinks.addLink(p)

p = Link("Baudouin", "Shcherba", 90,1,-.66,180,0.5,0)
myLinks.addLink(p)

p = Link("Baudouin", "Kruszewski", 90,.3,-.33,-90,0.3,0)
myLinks.addLink(p)



p = Link("Boas", "Sapir", 90,5,.5,-90,2,0)
myLinks.addLink(p)

p = Link("Boas", "Benedict", 90,1,0,-90,2,"-10pt")
myLinks.addLink(p)

p = Link("Boas", "Mead", 90,0,-.5,-90,0,0)
myLinks.addLink(p)
  
p = Link("Benedict", "Mead", 90,1,0,-90,2,.7)
myLinks.addLink(p)

p = Link("Sapir", "Swadesh", 90,1,1.2,-90,3,.7 )
myLinks.addLink(p)

p = Link("Sapir", "Newman", 90,1.5,.9,-90,1,0 )
myLinks.addLink(p)

p = Link("Sapir", "Haas", 90,1,.6,-90,2,.5)
myLinks.addLink(p)
p = Link("Sapir", "Hockett", 90,1,.3,-90,2,0.5)
myLinks.addLink(p)

p = Link("Sapir", "Voegelin", 90,0,0,-90,0,0,"postDoc")
myLinks.addLink(p)

p = Link("Sapir", "Harris", 90,1,-.3,-90,2,.3 )
myLinks.addLink(p)


p = Link("Sapir", "Kluckhohn", 90,1,-.6,-90,2.5,1.4, "influence")
myLinks.addLink(p)

p = Link("Sapir", "Whorf", 180,1,-.2,-90,2,0 )
myLinks.addLink(p)

p = Link("Sapir", "Pike", 90,1,-1,-90,3,1)
myLinks.addLink(p)

p = Link("Sapir", "Hoijer", 180,1,.1,-90,1,1, "influence" )
myLinks.addLink(p)

p = Link("Bloomfield", "Harris", 90,1,1.2,-90,2.5,-0.5 )
myLinks.addLink(p)

p = Link("Bloomfield", "Hockett", 90,1,.7,-90,2,-.2 )
myLinks.addLink(p)

p = Link("Bloomfield", "Pike", 90,1,-1,-90,4,-0.5 )
myLinks.addLink(p)

p = Link("Goodman", "Chomsky", 90,0,0,-90,0.8,-.4 )
myLinks.addLink(p)

p = Link("Quine", "Chomsky", 90,0,0,-90,.4,-0.6, "hostile")
myLinks.addLink(p)

p = Link("Sapir", "Koffka", -90,1,.7,-90,2,0 )
myLinks.addLink(p)

p = Link("Harris", "Chomsky", 0,1,.55,-90,0,-.2, "hostile" )
myLinks.addLink(p)

p = Link("BarHillel", "Chomsky", 90,1,0,-90,2,0 )
myLinks.addLink(p)

p = Link("Chomsky", "Halle", -90,1,0,-90,1,-.2 )
myLinks.addLink(p)

p = Link("Jakobson", "Halle", 90,1,.5,-90,2,0)
myLinks.addLink(p)

p = Link("Osthoff", "Saussure", 90,2,0,-90,1,.33 )
myLinks.addLink(p)

p = Link("Darwin", "Schleicher", 90,1,0,-90,2,0, "influence" )
myLinks.addLink(p)

p = Link("Frege", "Russell", 90,1,0,-90,2,0, "influence" )
myLinks.addLink(p)

p = Link("Russell", "Wittgenstein", 90,1,0,-90,2,0 )
myLinks.addLink(p)

p = Link("Trendelenburg", "Marty", 90,1,1,-90,6,0 )
myLinks.addLink(p)


p = Link("Trendelenburg", "Brentano", 90,1,.2,-90,6,1, "influence" )
myLinks.addLink(p)

p = Link("Comte", "Brentano", 90,4,0,-90,6.5,0, "influence" )
myLinks.addLink(p)

p = Link("Mill", "Brentano", 90,1,0,-90,6,-1, "influence" )
myLinks.addLink(p)



p = Link("Brentano", "Marty", 90,.5,1,-90,.5,-0.5 )
myLinks.addLink(p)

p = Link("Brentano", "Masaryk", 90,0,.6,-90,1,-.5 )
myLinks.addLink(p)

p = Link("Brentano", "Husserl", 90,0,.2,-90,1,1.5 )
myLinks.addLink(p)

p = Link("Brentano", "Meinong", 90,0,-.2,180,0,0 )
myLinks.addLink(p)



p = Link("Brentano", "Ehrenfels", 0,1,.4,-90,3,0 )
myLinks.addLink(p)

p = Link("Brentano", "Stumpf", 0,1,.1,-90,1,0 )
myLinks.addLink(p)

p = Link("Brentano", "Freud", 0,1,-0.2,-90,2,1 )
myLinks.addLink(p)

p = Link("Brentano", "Twardowski", 0,1 ,-0.5,-90,2,0 )
myLinks.addLink(p)



p = Link("Wertheimer","Heider", 90,1,.5,-90,3.5,0 )
myLinks.addLink(p)



p = Link("Stumpf", "Allport", 0,1,0,-90,1,-.5, "postDoc" )
myLinks.addLink(p)

p = Link("Stumpf", "Kohler", 90,1,.25,-90,6.75,0.5)
myLinks.addLink(p)

p = Link("Stumpf", "Langfeld",90,1,0,-90,3.25,1)
myLinks.addLink(p)


p = Link("Stumpf", "Wertheimer",90,1,-.25,-90,4,0 )
myLinks.addLink(p)

p = Link("Stumpf", "Kulpe", 90,1,-.5,-90,2,0 )
myLinks.addLink(p)




p = Link("Kulpe","Wertheimer", 90,1,.5,-90,2,0 )
myLinks.addLink(p)

p = Link("Kulpe","Koffka", 90,1.5,-.5,-90,2,0 )
myLinks.addLink(p)



p = Link("Masaryk","Mathesius", 90,1,0,-90,4.4,0 )
myLinks.addLink(p)

p = Link("Marty","Mathesius", 90,1,1,-90,5,1 )
myLinks.addLink(p)


p = Link("Buhler","Popper", 90,1,0,-90,2,0 )
myLinks.addLink(p)

p = Link("Helmholtz","Wundt", 90,1,-.5,-90,2,0 )
myLinks.addLink(p)
        
p = Link("James","Hall",0,1,0,-90,.2,.5 )
myLinks.addLink(p)

p = Link("Wundt","Hall", 90,1,1,-90,3,-.5 )
myLinks.addLink(p)

p = Link("Wundt","Kulpe", 90,1,.66,-90,2,-.5 )  
myLinks.addLink(p)

p = Link("Wundt","Titchener", 90,1,0,-90,3,0 )
myLinks.addLink(p)

p = Link("Wundt","Angell", 90,1,.33,-90,4.4,0 )
myLinks.addLink(p)

p = Link("Wundt","Cattell", 90,1,-.33,-90,1.5,0 )
myLinks.addLink(p)

p = Link("Wundt","Muensterberg", 90,1,-.66,-90,3.5,0 )
myLinks.addLink(p)

p = Link("Wundt","Chelpanov", 180,1,0,-90,2,.5 )
myLinks.addLink(p)

p = Link("Mach","Chelpanov", 90,6,1,-90,1,0)
myLinks.addLink(p)

p = Link("Mach","Loeb", 90,1,0,-90,3,0 )
myLinks.addLink(p)

p = Link( "Chelpanov", "Shpet", 90,1,0,-90,2,0 )
myLinks.addLink(p)

p = Link("Shpet","Jakobson", 90,1,1,-90,3,-1 )
myLinks.addLink(p)

p = Link("Loeb","Watson", 90,1,0,-90,2,-.5 )
myLinks.addLink(p)

p = Link("Angell","Watson", 90,.5,0,-90,1,1 )
myLinks.addLink(p)

p = Link("Titchener","Watson", 90,1,0,-90,2,0 )
myLinks.addLink(p)

p = Link("Watson", "Tolman",  0,.1,0,-90,-1,0 )
myLinks.addLink(p)

p = Link("Watson", "Lashley",  90,1,0,-90,2,0 )
myLinks.addLink(p)

p = Link("Watson", "Skinner",  90,1,0,-90,2,0 )
myLinks.addLink(p)

p = Link("Watson", "Hull",  180,0,0,-90,0,0 )
myLinks.addLink(p)

p = Link("Fortunatov", "Trubetzkoy",  90,1,0,-90,2,0 )
myLinks.addLink(p)


p = Link("Weber", "Breal",  90,1,0,-90,.5,0 )
myLinks.addLink(p)

p = Link("Breal","Fortunatov",  90,.5,0,-90,3,0 )
myLinks.addLink(p)

p = Link("Voegelin","Garvin",  90,1,0,-90,2,0 )
myLinks.addLink(p)

p = Link("Steinthal","Wundt",  90,1,0,-90,1,.5 )
myLinks.addLink(p)

p = Link("Humboldt", "Steinthal", 0,1,0,-90,1,.5, "influence" )
myLinks.addLink(p)

p = Link("Steinthal", "Boas", 180,1,-.2,-90,1,0, "influence" )
myLinks.addLink(p)

p = Link("Herder", "Humboldt", 90,1,.5,-90,1,1, "influence" )
myLinks.addLink(p)

p = Link("Kant", "Herder",90,-1,.5,-90,1,0 )
myLinks.addLink(p)



p = Link("Titchener", "Boring", 0,1,-.2,-90,1,.5 )
myLinks.addLink(p)

#p = Link("Muensterberg", "Allport", 180,1,-.2,-90,1,.5)
#myLinks.addLink(p)




p = Link("Kohler", "Allport", 90,4,-.2,180,0,0, "postDoc" )
myLinks.addLink(p)

p = Link("Wertheimer", "Allport", 90,1,-.2,180,1,-0.5, "postDoc" )
myLinks.addLink(p)


 

p = Link("Trubetzkoy", "Buhler", -90,1,-.2,-90,1,.5, "colleagues" )
myLinks.addLink(p)

p = Link("Hilbert", "Husserl", 0,1,0,180,3,0, "colleagues" )
myLinks.addLink(p)
 
p = Link("Allport", "Bruner", 90,1,-.2,-90,1,.5 )
myLinks.addLink(p)

p = Link("Sapir", "Lasswell", 180,1,.4,-90,1,0, "colleagues" )
myLinks.addLink(p)

p = Link("Giddings", "Ogburn", 90,1,0.0,-90,1,0, "teacher" )
myLinks.addLink(p)

p = Link("Giddings", "Odum", 90,1,0.5,-90,1,0, "teacher" )
myLinks.addLink(p)

p = Link("Giddings", "Chapin", 90,1,-0.5,-90,3,0.3, "teacher" )
myLinks.addLink(p)

p = Link("Hall", "Chapin", 90,1,-0.5,-90,3,-.3, "teacher" )
myLinks.addLink(p)
  
p = Link("Small", "Bernard", 90,1,-0.5,-90,3,.3, "teacher" )
myLinks.addLink(p)

p = Link("Giddings", "Small", 0,0,0,180,1,0, "hostile" )
myLinks.addLink(p)


  
p = Link("Dewey", "GHMead", 90,0,-0.5,-90,0,.3, "teacher" )
myLinks.addLink(p)
  

p = Link("Simmel", "Park", 0,0,0,-90,0,0, "teacher" )
myLinks.addLink(p)
  

p = Link("Trendelenberg", "Brentano", 0,0,0,-90,0,0, "teacher" )
myLinks.addLink(p)
  

for link in myLinks.linkList:
        thisAngleA = link.data[angleA]
        thisArmA = link.data[armA]
        thisOffsetA = link.data[offsetA]
        thisAngleB = link.data[angleB]
        thisArmB = link.data[armB]
        thisOffsetB = link.data[offsetB]
        thisLineStyle = "solid"
        thisLineColor = link.data[myLineColor]
        if thisLineColor=="postDoc":
                thisLineColor ="teacher"
                thisLineStyle = "dashed"
        formatstring = "\\ncangle[angleA={0:<3},armA={1:<4},offsetA={2:<5},angleB={3:<3},armB={4:<3},offsetB={5:<5},linecolor={6:<10},linestyle={7}]{{{8}}}{{{9}}}"
        #print >>outfile, formatstring.format(link.data[angleA],link.data[armA],link.data[offsetA],link.data[angleB],link.data[armB],link.data[offsetB],myLineColor,myLineStyle,link.data[fromNode],link.data[toNode])
        print >>outfile, formatstring.format(thisAngleA, thisArmA,thisOffsetA,thisAngleB, thisArmB, thisOffsetB,thisLineColor,thisLineStyle,link.data[fromNode], link.data[toNode]) 


print >>outfile, footer
outfile.close()
