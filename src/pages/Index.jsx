import React, { useEffect, useState } from "react";
import { Container, Text, VStack, Box, Link, Input, IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const color = useColorModeValue("black", "white");

  useEffect(() => {
    fetchTopStories();
  }, []);

  const fetchTopStories = async () => {
    try {
      const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      const storyIds = await response.json();
      const top10StoryIds = storyIds.slice(0, 10);
      const storyPromises = top10StoryIds.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
      );
      const stories = await Promise.all(storyPromises);
      setStories(stories);
      setFilteredStories(stories);
    } catch (error) {
      console.error("Error fetching top stories:", error);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = stories.filter(story =>
      story.title.toLowerCase().includes(term)
    );
    setFilteredStories(filtered);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" bg={bgColor} color={color}>
      <VStack spacing={4} width="100%">
        <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl">Hacker News Top Stories</Text>
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
          />
        </Box>
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {filteredStories.map(story => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="lg" width="100%" bg={useColorModeValue("white", "gray.700")}>
            <Text fontSize="lg" fontWeight="bold">{story.title}</Text>
            <Link href={story.url} color="teal.500" isExternal>Read more</Link>
            <Text>Upvotes: {story.score}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;