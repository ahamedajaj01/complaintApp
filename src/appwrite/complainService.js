import { Client, Databases, ID, Query, Permission, Role } from "appwrite";
import config from "../config/config"


export class ComplainService {
    databases;
    constructor(){
        this.client = new Client()
        .setEndpoint(config.appwriteUrl)
        .setProject(config.appwriteProjectId)
        this.databases = new Databases(this.client)
    }
    
  // Function to create a new complaint
async createComplaint(data){
   
    try {
        const userId = data.userId;     

        return await this.databases.createDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            ID.unique(),
            data,
            [
                    Permission.read(Role.user(userId)),
                            Permission.write(Role.user(userId)),

            ]
        );

    } catch (error) {
                console.error("Appwrite error:", error);
        throw error;
    }
}
// function to get user complaints
async getUserComplaints(userId){
    try {
        return await this.databases.listDocuments(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,

            [
                Query.equal("userId", userId)
            ]
        )
    } catch (error) {
        throw error;
    }
}
//  function to update a complaint from admin
async updateComplaint(complaintId, updatedData){
    try {
        return await this.databases.updateDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            complaintId,
            updatedData
        );
    } catch (error) {
        throw error;
    }
}

// function to get all user complaints in admin panel
async getAllComplaints(){
    try {
        return await this.databases.listDocuments(
            config.appwriteDatabaseId,
            config.appwriteCollectionId
        );
    } catch (error) {
       throw error 
    }
}


}


export const complainService = new ComplainService();
export default complainService;