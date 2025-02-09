import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { generateResponse } from "@/helpers/generateResponse";
import skills from "@/lib/constants"
import promptGeminiEverything from "@/helpers/prompters/promptgemini";
import { getDataFromToken } from "@/helpers/getDataFromToken";
connect();

let skillarray = "#C++ "

for (let i=0;i<skills.length;i++){
  skillarray+="#"+skills[i] + "\n"

}
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const userId = await getDataFromToken(request);
    const { previousprompts , prompt , type } = reqBody;
    let text;
    let defaultPrompt ;
      if( type == "PROJECT"){
        const OUTPUT_FORMAT = "Important! strictly generate the output as given json format {status:bool (success || error) , title: {title} , script:{details}} , in any ways if the prompt is irrelevant , you cannot generate anything , or happens any error or prompt doesnt obey rules or regulations give output as {status : error , message:{your message}} give the json and nothing else Recheck everything again so that it doesnt give any syntax error while parsing string into object" 
        if (previousprompts){
          defaultPrompt = prompt + "Above prompt is from a User wants to create a project , by the given prompt generate a title and topics for the skill for the user,  analyze the previous ones and make the script better  " + OUTPUT_FORMAT 
        }else
        defaultPrompt = prompt + "Above prompt is from a User wants to create a project , by the given prompt generate a title and topics for the skill for the user" + OUTPUT_FORMAT
        text = await generateResponse(defaultPrompt);
      }
      else if (type == "SKILL"){
        const OUTPUT_FORMAT = "Important! strictly generate the output as given json format {status:bool (success || error) , title: {title} , description:{description} , skillTag:{tag}} , in any ways if the prompt is irrelevant or you cannot generate anything or if the prompt doesnt match any predifined skill tags or happens any error or prompt doesnt obey rules or regulations give output as {status : error , message:{your message}} give the json and nothing else Recheck everything again so that it doesnt give any syntax error while parsing string into object"
        if (previousprompts){
          defaultPrompt = prompt + " \n Above prompt is from a user who wants to learn a skill" + skillarray + " these are the array of skill tags that are predefined for the app , assign a skill tag for the topic and generate a title and detailed description to check if thats what user wants to learn , this description will later be used for making a roadmap" + OUTPUT_FORMAT
        }else{
          defaultPrompt =prompt +  " \n Above prompt is from a user who wants to learn a skill" + skillarray + " these are the array of skill tags that are predefined for the app , assign a skill tag for the topic and genrate a title and detailed description to check if thats what user wants to learn , this description will later be used for making a roadmap analyze the previous prompts and make it better" + OUTPUT_FORMAT
        }
        text = await generateResponse(defaultPrompt);
       await promptGeminiEverything(userId,text.skillTag,"SKILL",text.title,text.description)
        
    }
    return NextResponse.json({ message: text, success: true });
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
