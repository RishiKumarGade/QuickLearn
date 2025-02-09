import { generateResponse } from "../generateResponse";
import WorkSpace from "@/models/workspaceModel"
import RoadMap from "@/models/roadmapModel"
import Quiz from "@/models/quizModel"
export default async function promptGeminiEverything(userId,skillTag,type,title,desc){
    try {
    let prompt;
    let roadmapData;
    if(type == "SKILL" || type == "ROADMAP"){
        const OUTPUT_FORMAT = "Important! generate the output as given json format {status:bool (success || error) , roadmap:[]} roadmap is a string array that each string is a step to complete , in any ways if the prompt is irrelevant , you cannot generate anything , or happens any error or prompt doesnt obey rules or regulations give output as {status : error , message:{your message}} give the json and nothing else Recheck everything again so that it doesnt give any syntax error while parsing string into object"
        prompt = title+"\n"+ desc + "Given above is a title and description of a skill that user wants to learn ,generate a roadmap that will fullfil the vision of user" + OUTPUT_FORMAT
        roadmapData = await generateResponse(prompt);
    }else if(type == "PROJECT"){
        const OUTPUT_FORMAT = "Important! generate the output as given json format {status:bool (success || error) , roadmap:[]} roadmap is a string array that each string is a step to complete , in any ways if the prompt is irrelevant , you cannot generate anything , or happens any error or prompt doesnt obey rules or regulations give output as {status : error , message:{your message}} give the json and nothing else Recheck everything again so that it doesnt give any syntax error while parsing string into object"
        prompt = title+"\n"+ desc + "Given above is a title and description of a project that user wants to work on , generate a roadmap that will fullfil the vision of user" + OUTPUT_FORMAT
        roadmapData = await generateResponse(prompt);
    }
    let ModuleData = [];
    let QuestionAnswersData = [];
    let RoadMapString= ""
    for(let i = 0; i <roadmapData.roadmap.length; i++){
        RoadMapString+=roadmapData.roadmap[i]
    }
    for(let i = 0; i <roadmapData.roadmap.length; i++){
        console.log("iterator " + i )
        if (type == "SKILL"){
            let OUTPUT_FORMAT = "Important! generate the output as given json format {status:bool (success || error) , slides:[]} slides is a string array that each string is a slide to read the info you can generate 10-30 slides for the section, in any ways if the prompt is irrelevant , you cannot generate anything , or happens any error or prompt doesnt obey rules or regulations give output as {status : error , message:{your message}} give the json and nothing else Recheck everything again so that it doesnt give any syntax error while parsing string into object"
            prompt ="Full Roadmap \n" + roadmapData.roadmap+"\n part: "+ roadmapData.roadmap[i] + "Given above is a Roadmap and its section of a skill that user wants to learn , generate learning module for the part of the roadmap" + OUTPUT_FORMAT
            let d = await generateResponse(prompt)
            if (d == false)
                return false;
            ModuleData.push(d)
            OUTPUT_FORMAT = "Important! generate the output as given json format {status:bool (success || error) , questionData:[{question , choices}],answers[]} questions is a object array that each object is a question and its choices to select and answers is a string array for correct options i.e A || B || C || D generate 5 to 10 questions, in any ways if the prompt is irrelevant , you cannot generate anything , or happens any error or prompt doesnt obey rules or regulations give output as {status : error , message:{your message}} give the json and nothing else Recheck everything again so that it doesnt give any syntax error while parsing string into object"
            prompt ="Full Roadmap \n" + roadmapData.roadmap+"\n part: "+ roadmapData.roadmap[i] + "Given above is a Roadmap and its section of a skill that user wants to learn , generate learning module for the part of the roadmap" + OUTPUT_FORMAT
            d = await generateResponse(prompt)
            if (d == false)
                return false;
            QuestionAnswersData.push(d)

        }else if(type == "PROJECT"){
            const OUTPUT_FORMAT = "Important! generate the output as given json format {status:bool (success || error) , slides:[]} slides is a string array that each string is a slide to read the info you can generate 10-30 slides for the section, in any ways if the prompt is irrelevant , you cannot generate anything , or happens any error or prompt doesnt obey rules or regulations give output as {status : error , message:{your message}} give the json and nothing else"
            prompt ="Full Roadmap \n" + roadmapData.roadmap+"\n part: "+ roadmapData.roadmap[i] + "Given above is a Roadmap and its section of a project that user wants to work on , generate learning module or a steps to complete or a suggestions for the part of the roadmap" + OUTPUT_FORMAT
            let d = await generateResponse(prompt,[])
            if (d == false)
                return false;
            ModuleData.push(d)
    }
}
const created = await createWorkSpace(userId,skillTag,type,title,desc,roadmapData,QuestionAnswersData,ModuleData);
return created
    }
    catch (err) {
        console.error(err)
    }
}

async function createWorkSpace(userId,skillTag,type,title,desc,roadmapData,QuestionAnswersData,ModuleData){
    try{
        const wsData = {title:title,description:desc,ownerId:userId, skillTag:skillTag,type:type}
        const ws = await WorkSpace.create(wsData);
        let rmData = {workspaceId:ws._id , title:wsData.title,learningModule:[]}
        
        for(let i = 0; i < roadmapData.roadmap.length;i++){
            let q = null

            if (type == "SKILL")
               q = await Quiz.create({questions:QuestionAnswersData[i].questionData,answers:QuestionAnswersData[i].answers});
            let lm = {title:roadmapData.roadmap[i] , slides: ModuleData[i].slides , quiz:q }
            rmData.learningModule.push(lm);
        }
        await RoadMap.create(rmData);
        return true
    }
    catch (e) {
        console.error(e)
        return false;
    }
}