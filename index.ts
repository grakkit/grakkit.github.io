type GithubRepositories = {
   total_count: number;
   incomplete_results: boolean;
   items: {
      id: number;
      node_id: string;
      name: string;
      full_name: string;
      private: boolean;
      owner: {
         login: string;
         id: number;
         node_id: string;
         avatar_url: string;
         gravatar_id: string;
         url: string;
         html_url: string;
         followers_url: string;
         following_url: string;
         gists_url: string;
         starred_url: string;
         subscriptions_url: string;
         organizations_url: string;
         repos_url: string;
         events_url: string;
         received_events_url: string;
         type: string;
         site_admin: boolean;
      };
      html_url: string;
      description: string;
      fork: boolean;
      url: string;
      forks_url: string;
      keys_url: string;
      collaborators_url: string;
      teams_url: string;
      hooks_url: string;
      issue_events_url: string;
      events_url: string;
      assignees_url: string;
      branches_url: string;
      tags_url: string;
      blobs_url: string;
      git_tags_url: string;
      git_refs_url: string;
      trees_url: string;
      statuses_url: string;
      languages_url: string;
      stargazers_url: string;
      contributors_url: string;
      subscribers_url: string;
      subscription_url: string;
      commits_url: string;
      git_commits_url: string;
      comments_url: string;
      issue_comment_url: string;
      contents_url: string;
      compare_url: string;
      merges_url: string;
      archive_url: string;
      downloads_url: string;
      issues_url: string;
      pulls_url: string;
      milestones_url: string;
      notifications_url: string;
      labels_url: string;
      releases_url: string;
      deployments_url: string;
      created_at: string;
      updated_at: string;
      pushed_at: string;
      git_url: string;
      ssh_url: string;
      clone_url: string;
      svn_url: string;
      homepage: string;
      size: number;
      stargazers_count: number;
      watchers_count: number;
      language: string;
      has_issues: boolean;
      has_projects: boolean;
      has_downloads: boolean;
      has_wiki: boolean;
      has_pages: boolean;
      forks_count: number;
      mirror_url?: any;
      archived: boolean;
      disabled: boolean;
      open_issues_count: number;
      license: {
         key: string;
         name: string;
         spdx_id: string;
         url: string;
         node_id: string;
      };
      allow_forking: boolean;
      is_template: boolean;
      topics: string[];
      visibility: string;
      forks: number;
      open_issues: number;
      watchers: number;
      default_branch: string;
      score: number;
   }[];
};

async function importJSON<X> (source: string): Promise<X | null> {
   try {
      return await (await fetch(source)).json();
   } catch {
      return null;
   }
}

importJSON<GithubRepositories>('https://api.github.com/search/repositories?q=topic:grakkit').then(async results => {
   for (const info of await Promise.all(
      results!.items.map(async item => ({
         author: {
            avatar: item.owner.avatar_url,
            link: item.owner.html_url,
            name: item.owner.login
         },
         repository: {
            description: item.description,
            homepage: item.homepage,
            link: item.html_url,
            marketplace: await importJSON<{
               platforms: string[];
            }>(`https://raw.githubusercontent.com/${item.full_name}/${item.default_branch}/.grakkit/marketplace.json`),
            name: item.name,
            stars: item.stargazers_count,
            topics: item.topics
         }
      }))
   )) {
      console.log(
         [
            '--------------------------------',
            `repository: ${info.repository.name} (${info.repository.link})`,
            `author: ${info.author.name} (${info.author.link})`,
            `stars: ${info.repository.stars}`,
            `description: ${info.repository.description}`,
            `homepage: ${info.repository.homepage}`,
            `topics: [ ${info.repository.topics.join(', ')} ]`,
            `platforms: [ ${info.repository.marketplace?.platforms.join(', ')} ]`,
            '--------------------------------'
         ].join('\n')
      );
   }
});
