import { graphql } from './graphql';
import { setGlobal } from 'reactn';

export async function fetchData(){
    
    var d = await graphql(`
        
        
      {
        overview {
          id
          headerTitle
          headerSubtitle
          headerDescription
          whitepaperUrl
          headerImage {
            url
          }
          bannerTitle
          bannerDescription
          bannerImage{
            url
          }
          slider {
            id
            title
            subTitle
            content
          }
          teamMembers {
            id
            name
            role
            image{
                url
            }
          }
          partners {
            id
            name
            logo{
              url
            }
          }
          infoTitle
          infoBlock{
            image{
              url
            }
            title
            content
          }
          roadmap {
            date
            content
          }
        }
      }
      
           

    `);
    if(d){
        setGlobal({appData: d});
    }
}